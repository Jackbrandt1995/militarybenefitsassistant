-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  middle_name text,
  last_name text,
  suffix text,
  ssn_encrypted text,
  dob date,
  sex text check (sex in ('Male', 'Female')),
  email text,
  phone_home text,
  phone_mobile text,
  address_street text,
  address_apt text,
  address_city text,
  address_state text,
  address_zip text,
  address_country text default 'US',
  va_file_number text,
  high_school_diploma boolean default false,
  high_school_diploma_date date,
  faa_certificates text,
  years_of_education integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Service periods
create table public.service_periods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  branch text,
  component text,
  date_entered date,
  date_separated date,
  service_status text,
  character_of_discharge text,
  involuntarily_called boolean default false,
  national_guard_duty_type text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Education history
create table public.education_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  institution text,
  location text,
  date_from date,
  date_to date,
  hours_count text,
  hours_type text check (hours_type in ('Semester', 'Quarter', 'Clock')),
  degree text,
  major text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Employment history
create table public.employment_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  principal_occupation text,
  license_or_rating text,
  months_worked integer,
  before_or_after_service text check (before_or_after_service in ('before', 'after')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Direct deposit
create table public.direct_deposit (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  account_type text check (account_type in ('Checking', 'Savings')),
  routing_number_encrypted text,
  account_number_encrypted text,
  bank_name text,
  created_at timestamptz default now()
);

-- Dependents
create table public.dependents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  relationship text,
  ssn_encrypted text,
  dob date,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Form submissions
create table public.form_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  form_id text not null,
  form_name text not null,
  answers_json jsonb,
  generated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.service_periods enable row level security;
alter table public.education_history enable row level security;
alter table public.employment_history enable row level security;
alter table public.direct_deposit enable row level security;
alter table public.dependents enable row level security;
alter table public.form_submissions enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Policies for related tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array['service_periods', 'education_history', 'employment_history', 'direct_deposit', 'dependents', 'form_submissions']
  loop
    execute format('create policy "Users can view own %s" on public.%s for select using (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can insert own %s" on public.%s for insert with check (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can update own %s" on public.%s for update using (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can delete own %s" on public.%s for delete using (auth.uid() = user_id)', tbl, tbl);
  end loop;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
