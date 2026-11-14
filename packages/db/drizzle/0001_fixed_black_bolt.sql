ALTER TABLE "booking_approvals" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;