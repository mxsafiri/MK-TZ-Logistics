CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'ops', 'accountant', 'driver', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('planned', 'in_transit', 'offloaded', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "member_role" NOT NULL,
	"token_hash" text NOT NULL,
	"invited_by" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now() + interval '7 days' NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "member_role" DEFAULT 'viewer' NOT NULL,
	"status" "member_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"base_currency" varchar(3) DEFAULT 'TZS' NOT NULL,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"contact_phone" varchar(32),
	"contact_email" varchar(320),
	"payment_terms_days" integer DEFAULT 30 NOT NULL,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" text,
	"name" varchar(255) NOT NULL,
	"phone" varchar(32),
	"license_no" varchar(64),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"origin" varchar(128) NOT NULL,
	"destination" varchar(128) NOT NULL,
	"distance_km" integer NOT NULL,
	"default_rate_minor" text,
	"default_currency" varchar(3),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trucks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"plate_number" varchar(32) NOT NULL,
	"make" varchar(64),
	"model" varchar(64),
	"capacity_kg" integer,
	"vehicle_type" varchar(32),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"trip_id" uuid NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"fx_rate_to_base" numeric(18, 8) DEFAULT 1 NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"method" varchar(32),
	"reference" varchar(128),
	"notes" text,
	"recorded_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"label" varchar(64) NOT NULL,
	"month" date NOT NULL,
	"notes" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"batch_id" uuid,
	"trip_date" date NOT NULL,
	"truck_id" uuid,
	"driver_id" uuid,
	"route_id" uuid,
	"client_id" uuid,
	"delivery_note_no" varchar(64),
	"cargo_description" varchar(255),
	"origin" varchar(128),
	"destination" varchar(128),
	"distance_km" integer,
	"currency" varchar(3) DEFAULT 'TZS' NOT NULL,
	"freight_advance_minor" bigint DEFAULT 0 NOT NULL,
	"freight_complete_minor" bigint DEFAULT 0 NOT NULL,
	"total_minor" bigint GENERATED ALWAYS AS ((freight_advance_minor + freight_complete_minor)) STORED,
	"fx_rate_to_base" numeric(18, 8) DEFAULT 1 NOT NULL,
	"status" "trip_status" DEFAULT 'planned' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"po_number" varchar(64),
	"offloaded_at" timestamp with time zone,
	"notes" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"entity" varchar(64) NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar(32) NOT NULL,
	"diff" jsonb,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rate_date" date NOT NULL,
	"from_currency" varchar(3) NOT NULL,
	"to_currency" varchar(3) NOT NULL,
	"rate" numeric(18, 8) NOT NULL,
	"source" varchar(64) DEFAULT 'exchangerate.host' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_batches" ADD CONSTRAINT "trip_batches_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_batch_id_trip_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."trip_batches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_truck_id_trucks_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitations_org_email_idx" ON "invitations" USING btree ("org_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_token_hash_idx" ON "invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_members_org_user_idx" ON "organization_members" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "organization_members_user_idx" ON "organization_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "clients_org_idx" ON "clients" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "drivers_org_idx" ON "drivers" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "drivers_user_idx" ON "drivers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "routes_org_idx" ON "routes" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trucks_org_plate_idx" ON "trucks" USING btree ("org_id","plate_number");--> statement-breakpoint
CREATE INDEX "trucks_org_idx" ON "trucks" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "payments_org_trip_idx" ON "payments" USING btree ("org_id","trip_id");--> statement-breakpoint
CREATE INDEX "payments_org_paid_at_idx" ON "payments" USING btree ("org_id","paid_at");--> statement-breakpoint
CREATE INDEX "trip_batches_org_month_idx" ON "trip_batches" USING btree ("org_id","month");--> statement-breakpoint
CREATE INDEX "trips_org_date_idx" ON "trips" USING btree ("org_id","trip_date");--> statement-breakpoint
CREATE INDEX "trips_org_batch_idx" ON "trips" USING btree ("org_id","batch_id");--> statement-breakpoint
CREATE INDEX "trips_org_payment_idx" ON "trips" USING btree ("org_id","payment_status");--> statement-breakpoint
CREATE INDEX "trips_truck_idx" ON "trips" USING btree ("truck_id");--> statement-breakpoint
CREATE INDEX "trips_driver_idx" ON "trips" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "trips_po_idx" ON "trips" USING btree ("org_id","po_number");--> statement-breakpoint
CREATE INDEX "audit_log_org_entity_idx" ON "audit_log" USING btree ("org_id","entity","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_org_created_idx" ON "audit_log" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_rates_pair_date_idx" ON "exchange_rates" USING btree ("rate_date","from_currency","to_currency");