-- create db schema in dbdigram.io

CREATE TABLE "traffic_source" (
  "id" bigserial PRIMARY KEY,
  "traffic_source_name" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "traffic_source_token" (
  "id" bigserial PRIMARY KEY,
  "traffic_source_token_name" bigint,
  "traffic_source_param_name" varchar NOT NULL,
  "traffic_source_param_query" varchar NOT NULL,
  "traffic_source_param_token" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "affiliate_network" (
  "id" bigserial PRIMARY KEY,
  "affiliate_network_name" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "lander" (
  "id" bigserial PRIMARY KEY,
  "lander_name" varchar NOT NULL,
  "lander_url" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "offer" (
  "id" bigserial PRIMARY KEY,
  "offer_name" varchar NOT NULL,
  "offer_url" varchar NOT NULL,
  "offer_affiliate_network" bigint,
  "offer_payout" bigint NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "flow" (
  "id" bigserial PRIMARY KEY,
  "flow_node_id" varchar NOT NULL,
  "flow_node" bigint,
  "flow_node_type" varchar,
  "flow_node_weight" bigint,
  "flow_node_parent" bigint,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "campaign" (
  "id" bigserial PRIMARY KEY,
  "campaign_uuid" varchar UNIQUE NOT NULL,
  "campaign_name" varchar NOT NULL,
  "campaign_traffic_source" bigint,
  "campaign_country" varchar NOT NULL,
  "campaign_tracking_domain" varchar NOT NULL,
  "campaign_flow" bigint,
  "campaign_cpc" bigint NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "hit" (
  "id" bigserial PRIMARY KEY,
  "hit_campaign_id" bigint,
  "hit_session_id" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "hit_query_string" (
  "id" bigserial PRIMARY KEY,
  "hit_id" bigint,
  "campaign_id" bigint,
  "hit_query_string_key" varchar NOT NULL,
  "hit_query_string_value" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "visit" (
  "id" bigserial PRIMARY KEY,
  "visit_hit_id" bigint,
  "visit_campaign_id" bigint,
  "visit_lander_id" bigint,
  "visit_offer_id" bigint,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "metric" (
  "id" bigserial PRIMARY KEY,
  "fk_hit_id" bigint,
  "fk_campaign_id" bigint,
  "referrer" varchar,
  "browser_name" varchar,
  "browser_version" varchar,
  "os" varchar,
  "os_version" varchar,
  "device" varchar,
  "is_mobile" boolean,
  "is_tablet" boolean,
  "is_desktop" boolean,
  "is_bot" boolean,
  "url" varchar,
  "postal_code" varchar,
  "city" varchar,
  "state" varchar,
  "country" varchar,
  "continent" varchar,
  "day_of_week" varchar,
  "hour_of_day" bigint,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

CREATE TABLE "conversion" (
  "id" bigserial PRIMARY KEY,
  "conversion_value" bigint NOT NULL,
  "fk_campaign_id" bigint,
  "fk_hit_session_id" varchar,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "created_date" date NOT NULL DEFAULT (now())
);

ALTER TABLE "traffic_source_token" ADD FOREIGN KEY ("traffic_source_token_name") REFERENCES "traffic_source" ("id");

ALTER TABLE "offer" ADD FOREIGN KEY ("offer_affiliate_network") REFERENCES "affiliate_network" ("id");

ALTER TABLE "campaign" ADD FOREIGN KEY ("campaign_traffic_source") REFERENCES "traffic_source" ("id");

ALTER TABLE "campaign" ADD FOREIGN KEY ("campaign_flow") REFERENCES "flow" ("id");

ALTER TABLE "hit" ADD FOREIGN KEY ("hit_campaign_id") REFERENCES "campaign" ("id");

ALTER TABLE "hit_query_string" ADD FOREIGN KEY ("hit_id") REFERENCES "hit" ("id");

ALTER TABLE "hit_query_string" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaign" ("id");

ALTER TABLE "visit" ADD FOREIGN KEY ("visit_hit_id") REFERENCES "hit" ("id");

ALTER TABLE "visit" ADD FOREIGN KEY ("visit_campaign_id") REFERENCES "campaign" ("id");

ALTER TABLE "visit" ADD FOREIGN KEY ("visit_lander_id") REFERENCES "lander" ("id");

ALTER TABLE "visit" ADD FOREIGN KEY ("visit_offer_id") REFERENCES "offer" ("id");

ALTER TABLE "metric" ADD FOREIGN KEY ("fk_hit_id") REFERENCES "hit" ("id");

ALTER TABLE "metric" ADD FOREIGN KEY ("fk_campaign_id") REFERENCES "campaign" ("id");

ALTER TABLE "conversion" ADD FOREIGN KEY ("fk_campaign_id") REFERENCES "campaign" ("id");