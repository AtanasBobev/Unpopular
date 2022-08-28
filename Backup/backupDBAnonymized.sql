--
-- PostgreSQL database dump
--

-- Dumped from database version 13.7 (Ubuntu 13.7-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.4

-- Started on 2022-08-28 16:59:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 35692778)
-- Name: heroku_ext; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "heroku_ext";


SET default_table_access_method = "heap";

--
-- TOC entry 201 (class 1259 OID 1077654)
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."comments" (
    "place_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "content" character varying NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "visible" boolean NOT NULL,
    "score" bigint NOT NULL,
    "id" bigint NOT NULL
);


--
-- TOC entry 202 (class 1259 OID 1077660)
-- Name: comments_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."comments_actions" (
    "user_id" bigint NOT NULL,
    "comment_id" bigint NOT NULL,
    "action" bigint NOT NULL,
    "action_id" bigint NOT NULL,
    "date" "date"
);


--
-- TOC entry 203 (class 1259 OID 1077663)
-- Name: comments_actions_action_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."comments_actions_action_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4146 (class 0 OID 0)
-- Dependencies: 203
-- Name: comments_actions_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."comments_actions_action_id_seq" OWNED BY "public"."comments_actions"."action_id";


--
-- TOC entry 204 (class 1259 OID 1077675)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4147 (class 0 OID 0)
-- Dependencies: 204
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."comments_id_seq" OWNED BY "public"."comments"."id";


--
-- TOC entry 205 (class 1259 OID 1077683)
-- Name: comments_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."comments_replies" (
    "relating" bigint NOT NULL,
    "content" character varying NOT NULL,
    "user_id" bigint NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "visible" boolean NOT NULL,
    "score" bigint NOT NULL,
    "id" bigint NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 1077700)
-- Name: comments_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."comments_replies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4148 (class 0 OID 0)
-- Dependencies: 206
-- Name: comments_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."comments_replies_id_seq" OWNED BY "public"."comments_replies"."id";


--
-- TOC entry 207 (class 1259 OID 1077707)
-- Name: favoritePlaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."favoritePlaces" (
    "user_id" bigint NOT NULL,
    "place_id" bigint NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "favorite_id" bigint NOT NULL
);


--
-- TOC entry 208 (class 1259 OID 1077717)
-- Name: favoritePlaces_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."favoritePlaces_favorite_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4149 (class 0 OID 0)
-- Dependencies: 208
-- Name: favoritePlaces_favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."favoritePlaces_favorite_id_seq" OWNED BY "public"."favoritePlaces"."favorite_id";


--
-- TOC entry 209 (class 1259 OID 1077723)
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."images" (
    "place_id" bigint NOT NULL,
    "url" character varying NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "image_id" bigint NOT NULL,
    "public_id" character varying NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 1077736)
-- Name: images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."images_image_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4150 (class 0 OID 0)
-- Dependencies: 210
-- Name: images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."images_image_id_seq" OWNED BY "public"."images"."image_id";


--
-- TOC entry 211 (class 1259 OID 1077742)
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."login_attempts" (
    "user" character varying NOT NULL,
    "ip" character varying,
    "time" character varying NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 1353532)
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."notes" (
    "user_id" bigint,
    "place_id" bigint,
    "note" character varying
);


--
-- TOC entry 212 (class 1259 OID 1077756)
-- Name: places; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."places" (
    "place_id" bigint NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "visible" boolean NOT NULL,
    "score" numeric NOT NULL,
    "placelocation" character varying NOT NULL,
    "category" numeric NOT NULL,
    "price" numeric NOT NULL,
    "accessibility" numeric NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "city" character varying NOT NULL,
    "dangerous" bigint NOT NULL,
    "user_id" bigint,
    "views" bigint DEFAULT 0
);


--
-- TOC entry 213 (class 1259 OID 1077769)
-- Name: places_place_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."places_place_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4151 (class 0 OID 0)
-- Dependencies: 213
-- Name: places_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."places_place_id_seq" OWNED BY "public"."places"."place_id";


--
-- TOC entry 214 (class 1259 OID 1077787)
-- Name: replies_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."replies_actions" (
    "user_id" bigint NOT NULL,
    "reply_id" bigint NOT NULL,
    "action" bigint NOT NULL,
    "comment_id" bigint NOT NULL,
    "action_id" bigint NOT NULL,
    "date" "date"
);


--
-- TOC entry 215 (class 1259 OID 1077797)
-- Name: replies_actions_action_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."replies_actions_action_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4152 (class 0 OID 0)
-- Dependencies: 215
-- Name: replies_actions_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."replies_actions_action_id_seq" OWNED BY "public"."replies_actions"."action_id";


--
-- TOC entry 216 (class 1259 OID 1077805)
-- Name: reported_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."reported_items" (
    "item_id" bigint NOT NULL,
    "type" character varying NOT NULL,
    "reason" character varying NOT NULL,
    "date" character varying NOT NULL,
    "user_id" bigint NOT NULL,
    "report_id" bigint NOT NULL,
    "priority" bigint NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 1077813)
-- Name: reported_items_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."reported_items_report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4153 (class 0 OID 0)
-- Dependencies: 217
-- Name: reported_items_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."reported_items_report_id_seq" OWNED BY "public"."reported_items"."report_id";


--
-- TOC entry 218 (class 1259 OID 1077821)
-- Name: savedPlaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."savedPlaces" (
    "user_id" bigint NOT NULL,
    "place_id" bigint NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "save_id" bigint NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 1077826)
-- Name: savedPlaces_save_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."savedPlaces_save_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4154 (class 0 OID 0)
-- Dependencies: 219
-- Name: savedPlaces_save_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."savedPlaces_save_id_seq" OWNED BY "public"."savedPlaces"."save_id";


--
-- TOC entry 220 (class 1259 OID 1077834)
-- Name: suggested_places; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."suggested_places" (
    "place_id" bigint,
    "title" character varying,
    "description" character varying,
    "placelocation" character varying,
    "category" numeric,
    "price" numeric,
    "accessibility" numeric,
    "dangerous" numeric,
    "suggested_user_id" bigint,
    "created_user_id" bigint,
    "id" bigint NOT NULL,
    "city" character varying
);


--
-- TOC entry 221 (class 1259 OID 1077842)
-- Name: suggested_places_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."suggested_places_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4155 (class 0 OID 0)
-- Dependencies: 221
-- Name: suggested_places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."suggested_places_id_seq" OWNED BY "public"."suggested_places"."id";


--
-- TOC entry 222 (class 1259 OID 1077854)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "username" character varying NOT NULL,
    "email" character varying NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "hash" character varying NOT NULL,
    "verified" character varying NOT NULL,
    "emailsent" character varying NOT NULL,
    "id" bigint NOT NULL,
    "avatar" character varying,
    "locked" boolean DEFAULT false NOT NULL,
    "admin" boolean,
    "avatar_public_id" character varying
);


--
-- TOC entry 223 (class 1259 OID 1077863)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4156 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";


--
-- TOC entry 224 (class 1259 OID 1077873)
-- Name: verification_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."verification_actions" (
    "verification_id" bigint NOT NULL,
    "user_id" bigint,
    "type" character varying,
    "url" character varying,
    "payload" character varying,
    "date" character varying
);


--
-- TOC entry 225 (class 1259 OID 1077881)
-- Name: verification_actions_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."verification_actions_verification_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4157 (class 0 OID 0)
-- Dependencies: 225
-- Name: verification_actions_verification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."verification_actions_verification_id_seq" OWNED BY "public"."verification_actions"."verification_id";


--
-- TOC entry 3922 (class 2604 OID 1077889)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."comments_id_seq"'::"regclass");


--
-- TOC entry 3923 (class 2604 OID 1077892)
-- Name: comments_actions action_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_actions" ALTER COLUMN "action_id" SET DEFAULT "nextval"('"public"."comments_actions_action_id_seq"'::"regclass");


--
-- TOC entry 3924 (class 2604 OID 1077893)
-- Name: comments_replies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_replies" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."comments_replies_id_seq"'::"regclass");


--
-- TOC entry 3925 (class 2604 OID 1077902)
-- Name: favoritePlaces favorite_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."favoritePlaces" ALTER COLUMN "favorite_id" SET DEFAULT "nextval"('"public"."favoritePlaces_favorite_id_seq"'::"regclass");


--
-- TOC entry 3926 (class 2604 OID 1077905)
-- Name: images image_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."images" ALTER COLUMN "image_id" SET DEFAULT "nextval"('"public"."images_image_id_seq"'::"regclass");


--
-- TOC entry 3927 (class 2604 OID 1077906)
-- Name: places place_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."places" ALTER COLUMN "place_id" SET DEFAULT "nextval"('"public"."places_place_id_seq"'::"regclass");


--
-- TOC entry 3929 (class 2604 OID 1077907)
-- Name: replies_actions action_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."replies_actions" ALTER COLUMN "action_id" SET DEFAULT "nextval"('"public"."replies_actions_action_id_seq"'::"regclass");


--
-- TOC entry 3930 (class 2604 OID 1077915)
-- Name: reported_items report_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reported_items" ALTER COLUMN "report_id" SET DEFAULT "nextval"('"public"."reported_items_report_id_seq"'::"regclass");


--
-- TOC entry 3931 (class 2604 OID 1077918)
-- Name: savedPlaces save_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."savedPlaces" ALTER COLUMN "save_id" SET DEFAULT "nextval"('"public"."savedPlaces_save_id_seq"'::"regclass");


--
-- TOC entry 3932 (class 2604 OID 1077919)
-- Name: suggested_places id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."suggested_places" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."suggested_places_id_seq"'::"regclass");


--
-- TOC entry 3934 (class 2604 OID 1077929)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");


--
-- TOC entry 3935 (class 2604 OID 1077932)
-- Name: verification_actions verification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."verification_actions" ALTER COLUMN "verification_id" SET DEFAULT "nextval"('"public"."verification_actions_verification_id_seq"'::"regclass");


--
-- TOC entry 4115 (class 0 OID 1077654)
-- Dependencies: 201
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."comments" ("place_id", "user_id", "content", "date", "visible", "score", "id") FROM stdin;
\.


--
-- TOC entry 4116 (class 0 OID 1077660)
-- Dependencies: 202
-- Data for Name: comments_actions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."comments_actions" ("user_id", "comment_id", "action", "action_id", "date") FROM stdin;
\.


--
-- TOC entry 4119 (class 0 OID 1077683)
-- Dependencies: 205
-- Data for Name: comments_replies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."comments_replies" ("relating", "content", "user_id", "date", "visible", "score", "id") FROM stdin;
\.


--
-- TOC entry 4121 (class 0 OID 1077707)
-- Dependencies: 207
-- Data for Name: favoritePlaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."favoritePlaces" ("user_id", "place_id", "date", "favorite_id") FROM stdin;
50	40	2022-01-04 10:01:58.324+00	1
51	40	2022-01-04 11:42:30.594+00	2
49	41	2022-01-04 11:55:23.786+00	3
48	40	2022-01-29 15:02:52.969+00	13
137	86	2022-02-10 20:54:34.661+00	66
138	40	2022-02-10 21:08:48.844+00	67
48	131	2022-02-11 07:20:37.369+00	68
48	131	2022-02-12 11:36:01.531+00	69
149	40	2022-02-14 10:19:05.039+00	70
149	64	2022-02-14 10:22:38.17+00	71
149	67	2022-02-14 10:25:37.76+00	72
149	69	2022-02-14 10:26:31.032+00	73
149	70	2022-02-14 10:26:34.978+00	74
149	62	2022-02-14 10:26:57.129+00	75
149	50	2022-02-14 10:28:04.869+00	76
149	85	2022-02-14 10:29:21.392+00	77
149	54	2022-02-14 10:29:49.793+00	78
163	41	2022-04-07 11:02:05.448+00	82
48	41	2022-04-16 06:13:10.305+00	83
\.


--
-- TOC entry 4123 (class 0 OID 1077723)
-- Dependencies: 209
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."images" ("place_id", "url", "date", "image_id", "public_id") FROM stdin;
40	https://res.cloudinary.com/dmffg8fxl/image/upload/v1641225977/uploads/oirtab9mwevqcmuqrypz.jpg	2022-01-03 16:06:18.618+00	40	uploads/oirtab9mwevqcmuqrypz
41	https://res.cloudinary.com/dmffg8fxl/image/upload/v1641297036/uploads/y9tvyvxbtdplapatqprn.jpg	2022-01-04 11:50:37.314+00	41	uploads/y9tvyvxbtdplapatqprn
44	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642444546/uploads/mzs1pwdrwmzmlypnskyk.jpg	2022-01-17 18:35:46.736+00	43	uploads/mzs1pwdrwmzmlypnskyk
44	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642444546/uploads/lrw0wxvadzjgrxfhkli3.jpg	2022-01-17 18:35:46.736+00	44	uploads/lrw0wxvadzjgrxfhkli3
44	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642444546/uploads/xocuxfq87ist4ifaagcy.jpg	2022-01-17 18:35:46.736+00	45	uploads/xocuxfq87ist4ifaagcy
46	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642450206/uploads/jm2mljczcxf1pogrnnze.jpg	2022-01-17 20:10:08.823+00	46	uploads/jm2mljczcxf1pogrnnze
46	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642450207/uploads/ea8y5sklgcy9aiokgbhf.jpg	2022-01-17 20:10:08.823+00	47	uploads/ea8y5sklgcy9aiokgbhf
46	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642450207/uploads/uzdrywlvyatkxdcjzc9c.jpg	2022-01-17 20:10:08.823+00	48	uploads/uzdrywlvyatkxdcjzc9c
47	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642489421/uploads/lstvrzbsu32insobcveu.jpg	2022-01-18 07:03:42.325+00	49	uploads/lstvrzbsu32insobcveu
47	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642489421/uploads/zeqqey0n3q7cjcogz6gf.jpg	2022-01-18 07:03:42.325+00	50	uploads/zeqqey0n3q7cjcogz6gf
49	https://res.cloudinary.com/dmffg8fxl/image/upload/v1642835724/uploads/hytaijnsiry7gkcf7mt6.jpg	2022-01-22 07:15:25.079+00	53	uploads/hytaijnsiry7gkcf7mt6
50	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643106472/uploads/ozay67uc1to0otqbtbme.jpg	2022-01-25 10:27:52.826+00	54	uploads/ozay67uc1to0otqbtbme
51	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643106644/uploads/pfumvvsjenvc1tl2qqaw.jpg	2022-01-25 10:30:45.247+00	55	uploads/pfumvvsjenvc1tl2qqaw
52	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643106854/uploads/kwhbtwvcg9qoiiniziq6.jpg	2022-01-25 10:34:14.708+00	56	uploads/kwhbtwvcg9qoiiniziq6
53	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643107009/uploads/y8xc7aosyewrdzg36wnw.jpg	2022-01-25 10:36:49.592+00	57	uploads/y8xc7aosyewrdzg36wnw
53	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643107008/uploads/dt8asr71ni2cmo7xrfuu.jpg	2022-01-25 10:36:49.592+00	58	uploads/dt8asr71ni2cmo7xrfuu
54	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643107296/uploads/rrseb4xuzzlghvjmgbgj.jpg	2022-01-25 10:41:36.941+00	59	uploads/rrseb4xuzzlghvjmgbgj
54	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643107296/uploads/bibwchuk09swnxuvpzyl.jpg	2022-01-25 10:41:36.941+00	60	uploads/bibwchuk09swnxuvpzyl
56	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643107927/uploads/o0ml8dqvrktmxf43hffu.png	2022-01-25 10:52:07.504+00	63	uploads/o0ml8dqvrktmxf43hffu
57	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643108278/uploads/xqjbcpivnnzue45gym8d.jpg	2022-01-25 10:57:59.18+00	64	uploads/xqjbcpivnnzue45gym8d
58	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643108468/uploads/npwufoi1fzoajyztl0m3.jpg	2022-01-25 11:01:09.618+00	65	uploads/npwufoi1fzoajyztl0m3
59	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643108722/uploads/blkrumeqgq5vfnne2tda.jpg	2022-01-25 11:05:23.004+00	68	uploads/blkrumeqgq5vfnne2tda
60	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643108974/uploads/pyt2tnudyncfatmjzsrv.jpg	2022-01-25 11:09:34.673+00	69	uploads/pyt2tnudyncfatmjzsrv
61	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643473583/uploads/rwb9zwjxkpttkmtvcxcm.jpg	2022-01-29 16:26:23.968+00	70	uploads/rwb9zwjxkpttkmtvcxcm
61	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643473583/uploads/ot2synwgirpalfyy5z5p.jpg	2022-01-29 16:26:23.968+00	71	uploads/ot2synwgirpalfyy5z5p
62	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643474504/uploads/jxhbmic50yfzbzmzvftw.jpg	2022-01-29 16:41:44.972+00	72	uploads/jxhbmic50yfzbzmzvftw
63	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643475313/uploads/iiqhrsu6bbcskalbu1yp.jpg	2022-01-29 16:55:14.229+00	73	uploads/iiqhrsu6bbcskalbu1yp
63	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643475313/uploads/e1pclocmtmdxoxjvgbze.jpg	2022-01-29 16:55:14.229+00	74	uploads/e1pclocmtmdxoxjvgbze
63	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643475313/uploads/pjowmkddm6vncbbeyjbc.jpg	2022-01-29 16:55:14.229+00	75	uploads/pjowmkddm6vncbbeyjbc
64	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643475865/uploads/sqwvqagzfyta840lo4vp.jpg	2022-01-29 17:04:25.906+00	76	uploads/sqwvqagzfyta840lo4vp
65	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643485472/uploads/c8bki2jjtd81kfaejifb.jpg	2022-01-29 19:44:32.519+00	77	uploads/c8bki2jjtd81kfaejifb
66	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643485889/uploads/wbgplvclipncnqf06dif.jpg	2022-01-29 19:51:30.414+00	78	uploads/wbgplvclipncnqf06dif
66	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643485889/uploads/emenh9cxumbquxwpqifu.jpg	2022-01-29 19:51:30.414+00	79	uploads/emenh9cxumbquxwpqifu
66	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643485890/uploads/juxtt1sjcin1kiymsh4p.jpg	2022-01-29 19:51:30.414+00	80	uploads/juxtt1sjcin1kiymsh4p
67	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643488092/uploads/jcjieknqcvrmhnmezyiw.jpg	2022-01-29 20:28:16.715+00	81	uploads/jcjieknqcvrmhnmezyiw
67	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643488096/uploads/tp63cuhcxr52vjvchs2h.jpg	2022-01-29 20:28:16.715+00	82	uploads/tp63cuhcxr52vjvchs2h
67	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643488094/uploads/ilnaj9kvtavdvk77t7q4.jpg	2022-01-29 20:28:16.715+00	83	uploads/ilnaj9kvtavdvk77t7q4
68	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489120/uploads/w8qsaeat6ez6nu3xnpxd.png	2022-01-29 20:45:20.773+00	84	uploads/w8qsaeat6ez6nu3xnpxd
68	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489114/uploads/uzf1p7lfqtqrrenvfbet.png	2022-01-29 20:45:20.773+00	85	uploads/uzf1p7lfqtqrrenvfbet
68	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489111/uploads/gfwyxd3wxiyjaqyvqxw6.png	2022-01-29 20:45:20.773+00	86	uploads/gfwyxd3wxiyjaqyvqxw6
69	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489350/uploads/w6rgslzi3pzhlzapg50b.jpg	2022-01-29 20:49:11.636+00	87	uploads/w6rgslzi3pzhlzapg50b
69	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489350/uploads/jqalwa3bivutma2rx4kw.jpg	2022-01-29 20:49:11.636+00	88	uploads/jqalwa3bivutma2rx4kw
69	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489351/uploads/qxcyik4rre3v3gmbe3b9.jpg	2022-01-29 20:49:11.636+00	89	uploads/qxcyik4rre3v3gmbe3b9
70	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489535/uploads/tzshnvwggkfsrrv3ktqy.jpg	2022-01-29 20:52:17.249+00	90	uploads/tzshnvwggkfsrrv3ktqy
71	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489775/uploads/d7oaygav74xh0tzl0ltt.jpg	2022-01-29 20:56:17.092+00	93	uploads/d7oaygav74xh0tzl0ltt
72	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489971/uploads/iktjbz73djt8lpt8c6ou.jpg	2022-01-29 20:59:31.931+00	95	uploads/iktjbz73djt8lpt8c6ou
73	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643490366/uploads/eudbnzaxnh5yakijfkwv.png	2022-01-29 21:06:10.348+00	96	uploads/eudbnzaxnh5yakijfkwv
55	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643491173/uploads/ihi0hsqaw7gyqzqirdiu.jpg	2022-01-29 21:19:36.295+00	106	uploads/ihi0hsqaw7gyqzqirdiu
71	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489776/uploads/w9unz99smtcog73c4hbv.jpg	2022-01-29 20:56:17.092+00	94	uploads/w9unz99smtcog73c4hbv
73	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643490367/uploads/m4rmlmx5pesluku2bjta.jpg	2022-01-29 21:06:10.348+00	97	uploads/m4rmlmx5pesluku2bjta
55	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643491175/uploads/gadt2wt62ynj43ofh0bo.jpg	2022-01-29 21:19:36.295+00	107	uploads/gadt2wt62ynj43ofh0bo
74	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643548404/uploads/vnd1zhshjd8kvpagxpbd.jpg	2022-01-30 13:13:25.207+00	108	uploads/vnd1zhshjd8kvpagxpbd
75	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643548805/uploads/lwoisvvcgjpvwkf95wre.jpg	2022-01-30 13:20:09.382+00	113	uploads/lwoisvvcgjpvwkf95wre
76	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643549022/uploads/bjvqlbdqwpaqzjovo8pb.jpg	2022-01-30 13:23:46.727+00	119	uploads/bjvqlbdqwpaqzjovo8pb
131	https://res.cloudinary.com/dmffg8fxl/image/upload/v1644530366/uploads/eutqlzkwb2qpxhnm8gqc.jpg	2022-02-10 21:59:49.037+00	209	uploads/eutqlzkwb2qpxhnm8gqc
133	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746149/uploads/urqk7gmje1xllbctagzn.jpg	2022-04-12 06:49:10.119+00	213	uploads/urqk7gmje1xllbctagzn
134	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746471/uploads/vgfhasqns8a5myxfrgzm.jpg	2022-04-12 06:54:32.04+00	218	uploads/vgfhasqns8a5myxfrgzm
135	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746837/uploads/lb7qcjhoqoco9t8r7msn.jpg	2022-04-12 07:00:38.231+00	221	uploads/lb7qcjhoqoco9t8r7msn
136	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747037/uploads/vao35nq8xkr7c2nb9iso.jpg	2022-04-12 07:03:58.097+00	222	uploads/vao35nq8xkr7c2nb9iso
137	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747588/uploads/qvhc1ft9adjexdyvf5pt.jpg	2022-04-12 07:13:10.892+00	224	uploads/qvhc1ft9adjexdyvf5pt
138	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747917/uploads/mc2uzc0i1sjephxqodwg.jpg	2022-04-12 07:18:38.069+00	227	uploads/mc2uzc0i1sjephxqodwg
139	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748037/uploads/vpouwulkiprkcnrqk8fb.jpg	2022-04-12 07:20:38.242+00	228	uploads/vpouwulkiprkcnrqk8fb
140	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748269/uploads/twe4tu1obwp3fh7rmepf.jpg	2022-04-12 07:24:29.859+00	230	uploads/twe4tu1obwp3fh7rmepf
143	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748960/uploads/wxgplpcxbttyqjc5mabs.jpg	2022-04-12 07:36:01.438+00	239	uploads/wxgplpcxbttyqjc5mabs
144	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749137/uploads/wia8ay04qmbnoy7esp0k.jpg	2022-04-12 07:38:57.818+00	243	uploads/wia8ay04qmbnoy7esp0k
145	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749256/uploads/rzomady4eil1omlwv5d5.jpg	2022-04-12 07:40:57.209+00	245	uploads/rzomady4eil1omlwv5d5
146	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749408/uploads/ml2v3lmmixyyzuf8jkrp.jpg	2022-04-12 07:43:29.19+00	248	uploads/ml2v3lmmixyyzuf8jkrp
147	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749561/uploads/hie6x3mvcbvq7yb6l9di.jpg	2022-04-12 07:46:02.185+00	250	uploads/hie6x3mvcbvq7yb6l9di
148	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749727/uploads/kwzykl2pb57tegfnlaoi.jpg	2022-04-12 07:48:48.581+00	254	uploads/kwzykl2pb57tegfnlaoi
149	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749845/uploads/cimzvd1arosbotctht2g.jpg	2022-04-12 07:50:48.941+00	256	uploads/cimzvd1arosbotctht2g
150	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749951/uploads/bbcjwvqtb3fcqwamyeqr.jpg	2022-04-12 07:52:31.99+00	258	uploads/bbcjwvqtb3fcqwamyeqr
151	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750102/uploads/nt9baqc9dvchliuf9ufb.jpg	2022-04-12 07:55:02.626+00	261	uploads/nt9baqc9dvchliuf9ufb
152	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750255/uploads/j8a44txaalmgnudpk38e.jpg	2022-04-12 07:57:36.181+00	262	uploads/j8a44txaalmgnudpk38e
153	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750590/uploads/ywvzqj7m8228h3iflyoq.jpg	2022-04-12 08:03:11.078+00	266	uploads/ywvzqj7m8228h3iflyoq
154	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750886/uploads/gauxjm3dd5eiywbbckxo.jpg	2022-04-12 08:08:07.538+00	268	uploads/gauxjm3dd5eiywbbckxo
142	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649842039/uploads/buwt7ljwfi2r9towtwim.jpg	2022-04-13 09:27:19.968+00	295	uploads/buwt7ljwfi2r9towtwim
74	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643548404/uploads/xmb1vkfysbnitsuno60j.jpg	2022-01-30 13:13:25.207+00	109	uploads/xmb1vkfysbnitsuno60j
75	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643548806/uploads/i1i8raipkhredavsnaob.jpg	2022-01-30 13:20:09.382+00	114	uploads/i1i8raipkhredavsnaob
131	https://res.cloudinary.com/dmffg8fxl/image/upload/v1644530388/uploads/boluykixribxw2atdxmw.jpg	2022-02-10 21:59:49.037+00	210	uploads/boluykixribxw2atdxmw
133	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746148/uploads/stwcdrnuzytpath1xznr.jpg	2022-04-12 06:49:10.119+00	214	uploads/stwcdrnuzytpath1xznr
134	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746471/uploads/kiwmycxssdhhm8fjslmt.jpg	2022-04-12 06:54:32.04+00	216	uploads/kiwmycxssdhhm8fjslmt
135	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746837/uploads/efeogoe2phxdyhbdj6w4.jpg	2022-04-12 07:00:38.231+00	220	uploads/efeogoe2phxdyhbdj6w4
136	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747037/uploads/fzx2sbd50dvesclhpx0r.jpg	2022-04-12 07:03:58.097+00	223	uploads/fzx2sbd50dvesclhpx0r
137	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747588/uploads/vn5dsu6ducg5d9b5oeqz.jpg	2022-04-12 07:13:10.892+00	225	uploads/vn5dsu6ducg5d9b5oeqz
138	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649747917/uploads/wy8n2ssinnykwnfsh1yh.jpg	2022-04-12 07:18:38.069+00	226	uploads/wy8n2ssinnykwnfsh1yh
139	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748037/uploads/zbiganemqr62piqbhk1c.jpg	2022-04-12 07:20:38.242+00	229	uploads/zbiganemqr62piqbhk1c
140	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748269/uploads/ownheponxcuse6tvc8bo.jpg	2022-04-12 07:24:29.859+00	232	uploads/ownheponxcuse6tvc8bo
141	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748576/uploads/td0mrhwosdulbbe0gfqf.jpg	2022-04-12 07:29:36.589+00	233	uploads/td0mrhwosdulbbe0gfqf
143	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748960/uploads/k3igosom4a8ugpzys197.jpg	2022-04-12 07:36:01.438+00	238	uploads/k3igosom4a8ugpzys197
144	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749137/uploads/wp4cziuxrqes1wafciuo.jpg	2022-04-12 07:38:57.818+00	241	uploads/wp4cziuxrqes1wafciuo
146	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749408/uploads/pgrzfkg7g361qfib4n2r.jpg	2022-04-12 07:43:29.19+00	247	uploads/pgrzfkg7g361qfib4n2r
147	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749561/uploads/ssajhmio0xnesgqpk4h3.jpg	2022-04-12 07:46:02.185+00	249	uploads/ssajhmio0xnesgqpk4h3
148	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749728/uploads/kiqc4ltvmizvvzctbwkx.jpg	2022-04-12 07:48:48.581+00	253	uploads/kiqc4ltvmizvvzctbwkx
149	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749845/uploads/nnlyxyk4wkqyzaehkamf.jpg	2022-04-12 07:50:48.941+00	255	uploads/nnlyxyk4wkqyzaehkamf
150	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749951/uploads/kfhn4yojfuy6nkzp5wx6.jpg	2022-04-12 07:52:31.99+00	257	uploads/kfhn4yojfuy6nkzp5wx6
151	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750102/uploads/oyitind8y7smurrjst2a.jpg	2022-04-12 07:55:02.626+00	259	uploads/oyitind8y7smurrjst2a
152	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750255/uploads/oz8bhhgphxuf170qz1du.jpg	2022-04-12 07:57:36.181+00	263	uploads/oz8bhhgphxuf170qz1du
153	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750589/uploads/ztg3cyiufzcqrj7x2jjk.jpg	2022-04-12 08:03:11.078+00	265	uploads/ztg3cyiufzcqrj7x2jjk
154	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750887/uploads/qqb7hs07rjawce7h4xjo.jpg	2022-04-12 08:08:07.538+00	270	uploads/qqb7hs07rjawce7h4xjo
170	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649866624/uploads/armzbpu5dvnthlrk48dk.jpg	2022-04-13 16:17:05.156+00	296	uploads/armzbpu5dvnthlrk48dk
75	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643548809/uploads/rbnidzcjpvkcn873q6mq.jpg	2022-01-30 13:20:09.382+00	115	uploads/rbnidzcjpvkcn873q6mq
76	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643549026/uploads/p66xzzm7st5nqkljutty.jpg	2022-01-30 13:23:46.727+00	120	uploads/p66xzzm7st5nqkljutty
77	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643549262/uploads/nwyzgpa62v15xe28oamx.jpg	2022-01-30 13:27:43.993+00	124	uploads/nwyzgpa62v15xe28oamx
131	https://res.cloudinary.com/dmffg8fxl/image/upload/v1644530352/uploads/vbbagicflabzirkrhiqy.jpg	2022-02-10 21:59:49.037+00	211	uploads/vbbagicflabzirkrhiqy
133	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746149/uploads/jtgba2jgrxtuulqybmql.jpg	2022-04-12 06:49:10.119+00	215	uploads/jtgba2jgrxtuulqybmql
134	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746471/uploads/gsheosdrygsw1geul8mo.jpg	2022-04-12 06:54:32.04+00	217	uploads/gsheosdrygsw1geul8mo
135	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649746836/uploads/vttfdeclbc1oqc7qz8ab.jpg	2022-04-12 07:00:38.231+00	219	uploads/vttfdeclbc1oqc7qz8ab
140	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748269/uploads/qipxkiyiqwus1gguuxck.jpg	2022-04-12 07:24:29.859+00	231	uploads/qipxkiyiqwus1gguuxck
141	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748576/uploads/htafj8oiwep01stzyy4w.png	2022-04-12 07:29:36.589+00	234	uploads/htafj8oiwep01stzyy4w
143	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649748960/uploads/nipzt1vzlfatuz7ktxrs.jpg	2022-04-12 07:36:01.438+00	240	uploads/nipzt1vzlfatuz7ktxrs
144	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749137/uploads/nynepretw8vqc092a54s.jpg	2022-04-12 07:38:57.818+00	242	uploads/nynepretw8vqc092a54s
145	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749256/uploads/whgnjpo7mv83mpdedhla.jpg	2022-04-12 07:40:57.209+00	244	uploads/whgnjpo7mv83mpdedhla
146	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749408/uploads/d2eztlrjnsblxsgzo4ql.jpg	2022-04-12 07:43:29.19+00	246	uploads/d2eztlrjnsblxsgzo4ql
147	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749561/uploads/f3qhs7roiuwre1qdyxlz.jpg	2022-04-12 07:46:02.185+00	251	uploads/f3qhs7roiuwre1qdyxlz
148	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649749727/uploads/gtpmvc1ofjltjvll8rwi.jpg	2022-04-12 07:48:48.581+00	252	uploads/gtpmvc1ofjltjvll8rwi
151	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750102/uploads/xmdzwvi8hlzf71ke44zs.jpg	2022-04-12 07:55:02.626+00	260	uploads/xmdzwvi8hlzf71ke44zs
152	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750255/uploads/dfthynzsnicfazy2u34x.jpg	2022-04-12 07:57:36.181+00	264	uploads/dfthynzsnicfazy2u34x
153	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750589/uploads/ov6p1ztwdbemk2vemce1.jpg	2022-04-12 08:03:11.078+00	267	uploads/ov6p1ztwdbemk2vemce1
154	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649750886/uploads/kaoxjqd1ufr8vsjeulse.jpg	2022-04-12 08:08:07.538+00	269	uploads/kaoxjqd1ufr8vsjeulse
76	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643549025/uploads/r26kpdzn3rpats4isrn5.jpg	2022-01-30 13:23:46.727+00	121	uploads/r26kpdzn3rpats4isrn5
77	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643549263/uploads/gy9kbosozs2rld35c6ya.jpg	2022-01-30 13:27:43.993+00	125	uploads/gy9kbosozs2rld35c6ya
155	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757266/uploads/eqn4kztsa84mpu8bl7a6.jpg	2022-04-12 09:54:27.954+00	271	uploads/eqn4kztsa84mpu8bl7a6
156	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757378/uploads/ddldzjy3ba3zp3wswf0c.jpg	2022-04-12 09:56:18.785+00	275	uploads/ddldzjy3ba3zp3wswf0c
157	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757586/uploads/wiyscykscfeu2etjkp47.jpg	2022-04-12 09:59:47.813+00	278	uploads/wiyscykscfeu2etjkp47
159	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758026/uploads/wr0uhm5zkxwac3xl3asn.jpg	2022-04-12 10:07:07.356+00	281	uploads/wr0uhm5zkxwac3xl3asn
160	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758128/uploads/zlblr0y8t42eqelyzrxl.jpg	2022-04-12 10:08:48.672+00	282	uploads/zlblr0y8t42eqelyzrxl
161	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758335/uploads/tkjxot48cew499ar8tgf.jpg	2022-04-12 10:12:15.713+00	283	uploads/tkjxot48cew499ar8tgf
162	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758430/uploads/se52ihaiunfuuxbuh8sb.jpg	2022-04-12 10:13:51.24+00	284	uploads/se52ihaiunfuuxbuh8sb
163	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758938/uploads/hwabxm4fgbeqjzooquhi.jpg	2022-04-12 10:22:19.61+00	286	uploads/hwabxm4fgbeqjzooquhi
164	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649759508/uploads/ccfl2hnfs4rg27p64dnz.jpg	2022-04-12 10:31:48.479+00	288	uploads/ccfl2hnfs4rg27p64dnz
79	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550277/uploads/ws3kkwyrmtextvtkk0jc.jpg	2022-01-30 13:44:40.041+00	132	uploads/ws3kkwyrmtextvtkk0jc
155	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757267/uploads/xpgrgiynzhizuhyj5hoh.jpg	2022-04-12 09:54:27.954+00	272	uploads/xpgrgiynzhizuhyj5hoh
156	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757378/uploads/qwjmyzbtrtkkwyo24tnb.jpg	2022-04-12 09:56:18.785+00	274	uploads/qwjmyzbtrtkkwyo24tnb
157	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757587/uploads/hnxs5pszjmgpdjwixith.jpg	2022-04-12 09:59:47.813+00	279	uploads/hnxs5pszjmgpdjwixith
158	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757752/uploads/crzwlv158u96tiharrtu.jpg	2022-04-12 10:02:32.853+00	280	uploads/crzwlv158u96tiharrtu
163	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649758939/uploads/zandsmnqgqkew7mq82em.jpg	2022-04-12 10:22:19.61+00	285	uploads/zandsmnqgqkew7mq82em
164	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649759507/uploads/arzxdfx04fdi3ofwesj8.jpg	2022-04-12 10:31:48.479+00	287	uploads/arzxdfx04fdi3ofwesj8
79	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550279/uploads/nryekomh69bxzwfwbahy.jpg	2022-01-30 13:44:40.041+00	133	uploads/nryekomh69bxzwfwbahy
80	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550484/uploads/mt5u3aecmwtzmpe0zx5f.jpg	2022-01-30 13:48:08.058+00	136	uploads/mt5u3aecmwtzmpe0zx5f
81	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550910/uploads/elel0lna4jnajhnv73cl.jpg	2022-01-30 13:55:10.945+00	140	uploads/elel0lna4jnajhnv73cl
82	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643551100/uploads/shcfpoqyubdycmp8cvwk.jpg	2022-01-30 13:58:21.501+00	142	uploads/shcfpoqyubdycmp8cvwk
83	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643551470/uploads/lteqpkspoic0okpekxrt.jpg	2022-01-30 14:04:31.215+00	145	uploads/lteqpkspoic0okpekxrt
84	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552147/uploads/y5jmhc9eteoj8y167okw.jpg	2022-01-30 14:15:49.419+00	146	uploads/y5jmhc9eteoj8y167okw
86	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552590/uploads/dful8w704zil0slmufok.jpg	2022-01-30 14:23:11.676+00	153	uploads/dful8w704zil0slmufok
155	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757267/uploads/a0sg70hzvgu1absp5lkz.jpg	2022-04-12 09:54:27.954+00	273	uploads/a0sg70hzvgu1absp5lkz
156	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757378/uploads/o4qwhgkpvfd2f3fvqikr.jpg	2022-04-12 09:56:18.785+00	276	uploads/o4qwhgkpvfd2f3fvqikr
157	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649757586/uploads/nkgsw9uytxq47avkksyo.jpg	2022-04-12 09:59:47.813+00	277	uploads/nkgsw9uytxq47avkksyo
78	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550325/uploads/q8akatngsl9bu4fpj1xh.jpg	2022-01-30 13:45:26.308+00	134	uploads/q8akatngsl9bu4fpj1xh
80	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550487/uploads/h2e7lilmrvstorw2bie5.jpg	2022-01-30 13:48:08.058+00	137	uploads/h2e7lilmrvstorw2bie5
81	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550910/uploads/rea9ia4kmr2onrj6obcs.jpg	2022-01-30 13:55:10.945+00	141	uploads/rea9ia4kmr2onrj6obcs
82	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643551101/uploads/iticleispocg7jrwrqwo.jpg	2022-01-30 13:58:21.501+00	143	uploads/iticleispocg7jrwrqwo
83	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643551470/uploads/p2mksq1zaxikv3iwiq4b.jpg	2022-01-30 14:04:31.215+00	144	uploads/p2mksq1zaxikv3iwiq4b
84	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552147/uploads/r6lb2try5micha4rfqog.jpg	2022-01-30 14:15:49.419+00	148	uploads/r6lb2try5micha4rfqog
85	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552424/uploads/e8i4s6plrajkxkvmrycd.jpg	2022-01-30 14:20:25.201+00	150	uploads/e8i4s6plrajkxkvmrycd
86	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552590/uploads/b1p02hggcgvmk2q4ofup.jpg	2022-01-30 14:23:11.676+00	151	uploads/b1p02hggcgvmk2q4ofup
165	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649778573/uploads/pnvra8bjbxdiytzc65fy.jpg	2022-04-12 15:49:33.767+00	289	uploads/pnvra8bjbxdiytzc65fy
166	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649779204/uploads/wxjqxavu9zcyxaj8mgc1.jpg	2022-04-12 16:00:05.327+00	290	uploads/wxjqxavu9zcyxaj8mgc1
167	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649779864/uploads/dlkg4xtohiyi6mlh1cca.jpg	2022-04-12 16:11:05.156+00	291	uploads/dlkg4xtohiyi6mlh1cca
168	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649780361/uploads/s9owaleyvzkjka2earc4.jpg	2022-04-12 16:19:21.494+00	292	uploads/s9owaleyvzkjka2earc4
78	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550325/uploads/dbfrpgwvbzdiafo3p1nl.jpg	2022-01-30 13:45:26.308+00	135	uploads/dbfrpgwvbzdiafo3p1nl
80	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550486/uploads/razqyxy2wdivbsrockxn.jpg	2022-01-30 13:48:08.058+00	138	uploads/razqyxy2wdivbsrockxn
81	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643550908/uploads/orthwwqqhoxzltuynzq8.jpg	2022-01-30 13:55:10.945+00	139	uploads/orthwwqqhoxzltuynzq8
84	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552149/uploads/fscg8eoaibzoosmd3kuy.jpg	2022-01-30 14:15:49.419+00	147	uploads/fscg8eoaibzoosmd3kuy
85	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552424/uploads/fhaki540qllothksl39x.jpg	2022-01-30 14:20:25.201+00	149	uploads/fhaki540qllothksl39x
86	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643552591/uploads/jj17g8egfcdsmdspvwou.jpg	2022-01-30 14:23:11.676+00	152	uploads/jj17g8egfcdsmdspvwou
169	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649781192/uploads/auvj1w6yacxadrplw6tt.jpg	2022-04-12 16:33:13.724+00	293	uploads/auvj1w6yacxadrplw6tt
169	https://res.cloudinary.com/dmffg8fxl/image/upload/v1649781193/uploads/nf9rhefbed1zccjzazuf.jpg	2022-04-12 16:33:13.724+00	294	uploads/nf9rhefbed1zccjzazuf
70	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489535/uploads/hyltlmu1gtte50pziphz.jpg	2022-01-29 20:52:17.249+00	91	uploads/hyltlmu1gtte50pziphz
71	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643489774/uploads/xoiyymg4psufylw5xnh6.jpg	2022-01-29 20:56:17.092+00	92	uploads/xoiyymg4psufylw5xnh6
73	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643490369/uploads/pat9havsb4bkyvifaj2l.png	2022-01-29 21:06:10.348+00	98	uploads/pat9havsb4bkyvifaj2l
55	https://res.cloudinary.com/dmffg8fxl/image/upload/v1643491170/uploads/qhdjykz7xfwgeibckilc.jpg	2022-01-29 21:19:36.295+00	105	uploads/qhdjykz7xfwgeibckilc
\.


--
-- TOC entry 4125 (class 0 OID 1077742)
-- Dependencies: 211
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."login_attempts" ("user", "ip", "time") FROM stdin;
bobevatanas@gmail.com	::1	2021-12-30T12:11:41.075+02:00
*****	::ffff:10.1.4.5	2022-01-07T14:08:48.817+00:00
*****	::ffff:10.1.20.210	2022-01-07T14:08:48.934+00:00
*****	::ffff:10.1.47.209	2022-01-07T14:08:49.129+00:00
*****	::ffff:10.1.39.194	2022-01-07T14:08:49.281+00:00
*****	::ffff:10.1.19.99	2022-01-07T14:08:51.292+00:00
*****	::ffff:10.1.25.195	2022-01-07T14:08:51.386+00:00
*****	::ffff:10.1.4.5	2022-01-07T14:08:51.415+00:00
*****	::ffff:10.1.20.210	2022-01-07T14:08:51.630+00:00
*****	::ffff:10.1.47.209	2022-01-07T14:08:53.580+00:00
*****	::ffff:10.1.19.99	2022-01-07T14:08:53.689+00:00
*****	::ffff:10.1.39.194	2022-01-07T14:08:53.694+00:00
*****	::ffff:10.1.38.166	2022-01-24T19:25:31.422+00:00
*****@gmail.com	::ffff:10.1.24.151	2022-01-26T12:58:35.806+00:00
*****@gmail.com	::ffff:10.1.46.221	2022-01-26T13:29:22.937+00:00
*****	::ffff:10.1.46.14	2022-02-02T09:25:13.419+00:00
*****@gmail.com	::ffff:10.1.38.22	2022-02-02T10:52:14.400+00:00
*****@gmail.com	::ffff:10.1.2.178	2022-02-02T11:51:33.744+00:00
*****	::ffff:10.1.12.141	2022-02-02T19:17:11.484+00:00
*****@gmail.com	::ffff:10.1.27.123	2022-02-03T10:09:46.910+00:00
*****@gmail.com	::ffff:10.1.30.230	2022-02-03T10:13:51.348+00:00
*****@gmail.com	::ffff:10.1.30.230	2022-02-03T10:13:56.628+00:00
*****	::ffff:10.1.29.193	2022-02-10T21:07:37.036+00:00
*****	::ffff:10.1.34.18	2022-02-26T08:36:53.634+00:00
*****	::ffff:10.1.1.211	2022-03-01T08:14:16.059+00:00
*****	::ffff:10.1.1.211	2022-03-01T08:14:30.163+00:00
\.


--
-- TOC entry 4140 (class 0 OID 1353532)
-- Dependencies: 226
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."notes" ("user_id", "place_id", "note") FROM stdin;
48	57	asdasdasd
48	56	
48	83	hhhhhhhh
48	40	aaaaa
48	51	наша бележка
48	41	hhhhh
\.


--
-- TOC entry 4126 (class 0 OID 1077756)
-- Dependencies: 212
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."places" ("place_id", "title", "description", "visible", "score", "placelocation", "category", "price", "accessibility", "date", "city", "dangerous", "user_id", "views") FROM stdin;
54	Цветарският магазин на Оборище	Цветарският магазине изключително красив и подходящ за снимки, особено ако е слънчево навън. На него има ореол от цветя, а на ъгъла на улицата малка бяла статуя на ангел посреща всеки клиент.\r\n\r\nСнимки:\r\nfoursquare.com\r\nselfhealingsuperfoods.com	t	0	42.693501247058485, 23.339188031167065	1	1	2	2022-01-25 10:41:36.933+00	София	1	48	3
46	Природен подлез	Подлезът има артистични пана, на които са изобразни различни природни елементи.\n\nИзточник: https://podlezno.org/priroden-podlez/	t	0	42.689322350550924, 23.340839230361834	4	1	3	2022-01-17 20:10:08.816+00	София	1	48	0
53	Малката горичка от секвои в Кюстендил	Малката горичка от секвои в Кюстендил е едно от най-невероятните места за снимки, поради пропорциите между обекта на снимане и човека.\r\n\r\nСнимки: peika.org	t	0	42.25197122679112, 22.66369793105427	3	1	3	2022-01-25 10:36:49.584+00	Кюстендил	1	48	1
56	Прегръдката	Насимо твори на много места в София и това е едно от тях. Заслужава си стенописът да се види.\r\n\r\nСнимка: Fine Art Factory	t	0	42.70038583869851, 23.32647084774072	4	1	2	2022-01-25 10:52:07.499+00	София	1	48	2
57	Паметник "Берлинската стена"	Малко хора знаят, че в център на София има парченце от берлинската стена.\r\n\r\nСнимка: opoznai.bg	t	0	42.68601708341762, 23.320805536735936	4	1	2	2022-01-25 10:57:59.176+00	София	1	48	1
52	Улица Париж	Улицата е особено подходяща за снимки поради много водещи линии. На нея се намират и множество старинни сгради.\r\n\r\nСнимки: sofia.media	t	0	42.697565709966234, 23.331309215942014	4	1	3	2022-01-25 10:34:14.703+00	София	1	48	0
47	Червената Веспа	Червената Веспа на ул. Оборище се е превърнала в символ на квартала. Той е пред частен дом и може да се види.	t	0	42.6945337,23.343213	6	1	2	2022-01-18 07:03:42.317+00	София	1	48	3
82	Къщата с дамата	Нерядко могат да се видят женски лица по фасадите на софийските сгради, но в този случай женската глава е нетипично по-изпъкнала - с буйни коси, в които, ако се вгледа човек, може да види дори вплетено цвете. Симпатични са и арката под женската глава и красивият еркер от другата страна на къщата. Жалко, че на места фасадата вече трудно устоява на силите на природата и тухлите й вече се виждат.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/100	t	0	42.69247665698787, 23.317944230748537	1	1	2	2022-01-30 13:58:21.496+00	София	1	48	119
49	Улица Малко Търново	Ул. Малко Търново е най-малката със своите 60 метра и най-стръмна улица в София. Тя носи историята на София с руините откитити под нея и факта, че се намира на ключово място в София. Улицата е особено специална за снимки поради много водещи линии.	t	0	42.69758227414015, 23.326566750493015	4	1	3	2022-01-22 07:15:25.072+00	София	1	48	3
50	Ботаническата градина в София	Мястото е изключително подходящо за снимки поради много ефекти, които могат да се създадът около растенията.	t	0	42.64337177656478, 23.297832721936363	4	2	3	2022-01-25 10:27:52.815+00	София	1	48	1
51	Сградата на софийската опера и балет	Мястото представя невероятни възможности за снимки. Сградата има много одещи линии, а особено ефектни са снимките, снимани отдолу нагоре, за да се хваща сградата на заден фон.\r\n\r\nСнимка: visitsofia.org	t	0	42.69813001654265, 23.330385753975722	4	1	2	2022-01-25 10:30:45.241+00	София	1	48	2
136	Копренски водопади	Копренските водопади, намиращи се на Копренската екопътека, представляват една от най-красивите поредица водопади в северозападна България. Те се намират в Чипровския балкан на Западна Стара планина, в подножието на връх Копрен. Мястото е и в изключителна близост до границата със съседна Сърбия.\r\nКопренските водопади са поредица от 3 водопада: Друшин скок, Ланжин скок и Воден скок. Те не са много високи и достигат височина от едва 10 метра, а най-ниският от тях е 5 метра висок. Това бива компенсирано с пълноводието им и романтичната обстановка, която създават. Водопадите са заобиколени от невероятно красива природа, чист въздух и страхотно обагрени букови гори. Това място е запазено непокътнато от индустриализацията на света и може да се усети естествената природна атмосферата.\r\n\r\nНай-подходящото време за посещението е след дъждовния период през пролетта или през есента. След дъждовете цялата гора е покрита с изящна зеленина, а и водопадите са най-пълноводни в този период, което ги представя в пълния им блясък. Другият добър момент да ги посетите е есента, когато гората е обагрена в най-различни цветове. Също така, тогава ще можете да наблюдавате падналите листа от дърветата, стичащи се надолу по водопада. Лятото не е особено добър момент за посещение на този обект, поради факта че водопадите не са достатъчно пълноводни.\r\n\r\nКопренските водопади са на 130 километра от София. Начална точка за похода към тях може да се счита село Копиловци, откъдето и започва Копренската екопътека. Тръгвайки от селото, има и асфалтов път водещ до хижа „Копрен“. Там може да се намери и повече информация за местността, забележителностите и най-вече за екопътеката до водопадите. Екопътеката е с дължина от около 20 километра и се смята за една от най-дългите в България. Цялостното време за прехода до връх Копрен би отнело около 5 часа и се препоръчва да се извършва с опитен водач, който познава околността. Местността е рискова и стръмна, затова се препоръчва да си отделите достатъчно време за отиване и връщане, без да бързате. Част от прехода минава в невероятна близост до границата със Сърбия. Екопътеката минава през два от водопадите – Друшин скок и Воден скок, за тях има ясни обозначения и табели, насочващи в правилната посока.\r\nЗа жалост няма такива обозначения, водещи към третия от водопадите, а именно Ланжин скок. До него може да се стигне единствено по указанията на местните или с пътеводител за местността. По пътя към водопадите могат да се срещнат и множество диви животни, затова трябва да се внимава с преминаването и да се следват обозначените пътища.\r\n\r\nМястото е силно отдалечено от села и градове, а затова и се е запазило непокътнато и може да се наблюдава неподправената красота на българската природа. Цялата екопътека е доста дълга, но не е нужно човек да осъществява целия преход.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/koprenski-vodopadi/	t	0	43.311676,22.83084	3	1	4	2022-04-12 07:03:58.091+00	Чипровци	2	48	0
86	Кулата с балкона	Заслужава уважение архитектът, който смело е импровизирал, създавайки такава красива и нестандартна къща. Тя елегантно обединява в себе си много и разнообразни архитектурни елементи.\nЗаострeният покрив на кулата е комбиниран с колони, изваяни във фасадата, а огромния балкон вдясно от нея завършва с арки, които водят към вътрешността на жилището. Сградата е перла, която една реновация би превърнала в истински диамант.\n\nТекст и снимки: https://www.altersofia.com/tr/buildings/building/234	t	0	42.69372994278285, 23.31427083680155	1	1	2	2022-01-30 14:23:11.671+00	София	1	48	63
58	Клуба на пътешественика	В центъра на София има клуба на пътешественика, където всяка седмица мечтатели и пътешественици се събират и един човек разказва за преживяванията си.\r\n\r\nСнимка и сайт: travellersclub.bg	t	0	42.70137726581535, 23.324035730320183	6	1	2	2022-01-25 11:01:09.61+00	София	1	48	2
137	Село Ковачевица	Ковачевица е малко селце, скрито в склоновете на Западните Родопи, на само около 25 километра североизточно от град Гоце Делчев. Селото е разположено по поречието на река Канина, още позната като Кървава река. Надморската височина от приблизително 1000 метра в комбинация с географската ширина, закътаното местоположение и наличието на река правят селцето истински климатичен рай. В Ковачевица зимите са сравнително меки, а летата – приятно прохладни. Днес Ковачевица има постоянно население от едва около 50 души, но пък за сметка на това е посещавано от туристи. Тук са снимани редица съвременни филмови продукции.\r\nСъс своята автентична архитектура селото е истински портал към миналите векове. Технологията на строенето на къщите в тази част на Родопите включва каменна зидария, която всъщност е проста за правене, но се оказва доста издръжлива. Подредените недялани камъни, биват споени с размекната пръст, за да оформят масивни зидове, чиято трайност е изпитвана многократно през годините. Други интересни компоненти в повечето ковачевски къщи са техните покриви, също направени от плоски камъни.\r\n\r\nТесните калдъръмени улички на Ковачевица са изпълнени почти само с такъв тип къщи, някои двуетажни, а други дори и на три нива. Спазени са познатите възрожденски еркерни наддавания на по-високите етажи от къщите. Фактът, че почти цялото село се състои от такъв тип къщи, създава неповторимо усещане, сякаш човек се е върнал назад в миналото.\r\n\r\nИ действително по време на Възраждането село Ковачевица представлява център на строително-архитектурната школа в района на Югозападните Родопи. Доказателство за майсторлъка на местните дюлгери е не само красивият външен вид на постройките, но и фактът, че те са оцелели толкова дълго, при положение, че някои от тях не се стопанисват.\r\n\r\nПървите български заселници на територията на днешна Ковачевица са от самия край на на XIV век, след османското завоевание на българските земи. Поради благоприятните природни условия малкото селище бързо се разраства и жителите започват да се занимават с най-различни дейности – земеделие, скотовъдство, строителство и занаятчийство. Интересен факт е, че Ковачевица никога не е било под директното влияние на турска администрация. Това позволява на селото да се превърне в един оазис на свободно развитие, което оформя селото като културно-религиозен център в околността. Културният напредък на Ковачевица по време на Възраждането не се е ограничава само до забележителната архитектурната дейност. В селото е основано първото килийно училище в Неврокопска област през 1820 година. Около двадесет и пет години по-късно в селото е учредено и светско училище. Трябва да се спомене и че жителите на селото многократно са помагали на четническите движения в района, най-вече на четите на Славко войвода, Шимар войвода и Кануш войвода.\r\n\r\nКовачевица е село, в което човек може да усети духа на нашите предци и да докосне и види това, което техните ръце са сътворили. Разхождайки се по тесните улички човек немее пред автентично запазения вид на това истинско Родопско бижу.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/kovachevitsa/\r\n	t	0	41.684525,23.833629	3	1	3	2022-04-12 07:13:10.885+00	Гоце Делчев	1	48	0
133	Орлово око	Платформата „Орлово око“ представлява амбициозен проект на община Ягодина, построен през 2009 година. Самата платформа се намира в Западните Родопи, разположена близо до село Ягодина. От нея се разкрива невероятна гледка към Буйновското ждрело, село Борино, село Чала, село Ягодина, както и към величествените планини Рила, Пирин и Беласица. Платформата е разположена на 1530 метра надморска височина, което дава възможност на наблюдателя да види дори и части от Гърция.\r\nВ региона тече река Буйновска, която създава живописната картина на Буйновското ждрело, което е включено в 100-те национални туристически обекта на България. Друга забележителност в района е Ягодинската пещера. Парите, събирани от входове за пещерата, са били използвани именно за построяването на панорамната платформа. Сумата, използвана за построяването на „Орлово око“, е 21 000 лева.\r\nМаршрутът за стигане до „Орлово око“ минава покрай Буйновското ждрело и се изкачва до връх Свети Илия, като преходът е около 10 километра. Самото изкачване на панорамната площадка „Орлово око“ става с помощта на високопроходимо превозно средство или пеша. В случай, че се избере първата опция, пътят до там трае около 20-30 минути. При ходене пеша човек трябва да си отдели поне час. Чрез ходенето пеша човек може да съчетае посещението на площадката с приятна разходка из родопската природа, докосвайки се до нейната красота и хармония.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/orlovo-oko/\r\n	t	0	41.63895,24.345264	3	1	4	2022-04-12 06:49:10.106+00	Ягодина	2	48	1
138	Побитите камъни	Природният феномен „Побитите камъни“ или „Дикилиташ“ е разположен на около 20 километра от град Варна и в непосредствена близост до село Слънчево. Природната забележителност представлява съвкупност от каменни колони и различни скални образувания с височина до 10 метра и дебелина до 3 метра. Представляват кухи, плътни или пълни с пясък цилиндри, пресечени конуси и други различни форми. Някои от тях лежат на земята, все едно са премахнати от местата им, докато мнозинството от тях са все едно „забити“ или „побити“ в земята (откъдето идва и името им).\r\n\r\nИнтересното е, че много от тях с времето са образували множество странни и забележителни форми – „камъкът на сърцето“, „кръгът на желанията“ и други.\r\n\r\nЕдно от уникалните неща е, че местността, в която се намират Побитите камъни, е единствената естествено формирана пустиня в източна Европа. Също така е една от двете естествено формирани пустини в цяла Европа. Местността е включена в списъка на „Натура 2000“ с цел запазването на най-големия вътрешен пясъчен хабитат в страната с неговата флора и фауна. Ярки представители на тази флора са кактуси, планинската роза, акацията и други. Друго, с което може да се характеризира тази местност, е финия и ситен, почти бял пясък. Също така на територията на природния парк се намира и единственото находище на растението „песъчарка“ в България.\r\n\r\n\r\n\r\n\r\nСъществуват множество теории за създаването на тези природни феномени, като съществуващите теории се делят на два вида – органични и неорганични. Според първия вид, скалните образувания са се образували преди милиони години чрез ерозиони процеси и изветряне, поради действието на морската вода и атмосферата. Другата гледна точка пък разглежда идеята, че побитите камъни са останки от древни коралови рифтове, биогенни водораслови струпвания, вкаменени гори или вкаменени газови извори. Единственото обаче, което е сигурно, е че тези скални образувания не са дело на човека.\r\n\r\nБез значение техния произход, можем да кажем, че „Побитите камъни“ са със сигурност едно от най-уникалните места в България, което всеки рано или късно трябва да посети. Точно и затова те често служат за снимачни площадки както и на български, така и на световни кино продукции.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/pobitite-kamuni/	t	0	43.2333314,27.6491571,14z	3	2	3	2022-04-12 07:18:38.064+00	Варна 	1	48	0
131	Водопад Казанчето	Малък, но много уютен водопад в сърцето на Странджа. Изходна точка е с. Костѝ. Пътят покрай малката рекичка, приток на Велека е изключително красив. Минава се и покрай остатъците от фундамента на несъществуващата вече теснолинейка Ахтопол-Костѝ.	t	0	42.0553, 27.8000	3	1	4	2022-02-10 21:59:49.033+00	Странджа	1	136	113
140	Крепостта Овеч край Провадия	Овеч е средновековна крепост, извисяваща се върху скалистия хълм „Калето“ край град Провадия, намиращ се на около 50 километра западно от Варна. Крепостта е построена още през III – IV век от римляните с цел защита от зачестилите варварски набези. Овеч се използва активно до VII век, а след това отново от XI до края на XVII век. През годините крепостта бива населявана последователно от траки, римляни, българи и турци. Римляните наричали крепостта с името Проват или Проватон, българите я назовавали Овеч, а турците – Таш хисар (каменна крепост).\r\n\r\n\r\nОвеч придобива особено важно значение по време на Второто българско царство, когато става ключов военен, административен, стопански и духовен център в региона. Най-емблематичните моменти на крепостта са свързани с управлението на цар Ивайло, когато българските воини заедно със своя владетел завоюват две важни победи срещу многохилядни византийски нападения. Също така през XIV век Овеч става седалище на митрополия.\r\nКрепостта е естествено защитена от високи скални стени, оформящи горните части на хълма, върху който е разположена твърдината. Източният вход към укреплението е запазен в своя автентичен вид с изсечени в скалата каменни стъпала, а подобни стълби има и от западната страна. Тези два подхода определено ще се харесат на любителите на автентичното историческо наследство.\r\n\r\nКласическият начин за изкачване до най-високата част на платото обаче е друг. Това става по така наречената екопътека „Овеч“. Тя започва именно от западното подножие на платото, като се изминава съвсем спокойно за около 15 минути. Следва голямо спираловидно стълбище, състоящо се от точно 111 стъпала. Качим ли се по него, ще се озовем на върха на крепостния хълм.\r\nГледката отгоре е наистина удивителна. Навсякъде около нас се простират хълмове и плата, оформяйки неописуем пейзаж. Долу под нас е сгушен и самият град Провадия, който също се вижда отлично. Започваме да разглеждаме историческите останки. Виждаме ясните основи на църкви, храмове, кули, затвори и всякакви други помещения.\r\nИма и запазен кладенец, чиято дълбочина е цели 79 метра. Можете да тропнете по покриващата кладенеца ламарина, за да чуете звучното ехо и да се убедите в огромната му дълбочина. Безспорно най-запомнящата се част обаче е северната порта на укреплението. Тя всъщност е крепостна кула на 3 етажа с порта на най-долното ниво. Човек може да се изкачи до най-високата част на кулата, а обширният кръгозор, откриващ се оттам, наистина си струва.\r\n\r\nОтвъд северната порта се простира голям дървен мост дълъг над 150 метра, който води до съседното плато на име Табиите. Там може да намерите чудесно място за отдих, както и прекрасна гледка назад към твърдината. Емблематичната картина на дървения мост, отвеждащ към главната крепостна порта, е незабравима.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/krepostta-ovech/	t	0	43.175487,27.447737,10z	3	1	4	2022-04-12 07:24:29.854+00	Провадия	2	48	1
142	Осмарски скални манастири	Осмарските скални манастири са средновековни помещения издълбани във варовикови скали, намиращи се югозападно от Шумен. Разпръснати по Шуменското плато и създадени през Второто българско царство (XII – XIV в.), манастирите са културно наследство на исихазма в България. Най-големият разцвет на скалните манастири е дошъл през XIV в., когато цар Иван-Александър признава исихазма.\r\n\r\nИсихазмът е източно православна вяра, която проповядва, че за да се свържеш с Бога, трябва да очистиш душата си и да откриеш вътрешен мир. Исихастите са водили отшелнически начин на живот в манастири, често скални по вид. Помещенията в Шуменското плато имат разновидност от предназначения: манастири, църкви, монашески килии.\r\n\r\nНай-големият от Осмарските скални манастири е Костадиновия манастир, изграден в отвесна скала. Той се състои от две помещения, като едното е църква с фрагменти от стенописи и олтар. Входът към Костадиновия манастир се намира на 8-10 метра височина, а до него може да се стигне по новоизградени метални стълби.\r\n\r\nВ близост до Костадиновия манастир се намира скалният феномен „Окото на Осмар“, също наричан и „Халката“. Той представлява отвесна скала, в която сякаш е издълбано „око“, в което като погледнеш, сякаш се открива друг свят. Великолепна гледка! Според самата баба Ванга, този скален феномен е четвъртият по сила енергиен център в България (след Рупите, Царичина и Мадара).\r\n\r\nОще една интересна скална обител е Диреклията, намираща се на около стотина метра от Костадиновия манастир. В нея няма как да влезете без катерачески съоръжения, но можете да погледнете вътрешността ѝ от съседната скала. Смята се, че някога Диреклията е била използвана за монашеска килия, в която са затваряли монасите, които не са следвали строго принципите на исихазма.\r\n\r\nСело Осмар е и хубаво местенце за любителите на селски туризъм. Известно е с виното си „осмарски пелин“. В района винопроизводството се развива от XIX в. В Осмар има винарска изба, където имате възможността да пробвате бял и/или червен пелин. Също, първото българско шампанско е било произведено точно в този район на България.\r\n\r\nОсмарските скални манастири са само няколко от всичките разпръснати по Шуменското плато. В близост се намират Троицките манастири (на 2-2,5 км северно от село Троица), най-известният от които е скалният манастир „Момина скала“. Още малко на изток стигаме и до Ханкрумовския манастир (над село Хан Крум). До повечето от тях има маркирани и приятни за разходка екопътеки.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/osmarski-skalni-manastiri/\r\n	t	0	43.2461,26.851582	3	1	4	2022-04-12 07:33:26.648+00	Шумен	2	48	3
59	Арт Къща Куклите	Арт Къща Куклите е музей в София където можете да видите над 3000 различни кукли.\r\n\r\nСнимка: opoznai.bg	t	0	42.69403257223305, 23.31692391484217	6	2	3	2022-01-25 11:05:22.997+00	София	1	48	2
55	Къщата с Ягодите	Един от първите ми ясни спомени от детството е свързан с дядо ми. Разхождаме се из малките калдъръмени улички около „Докторската градина”, а той ми разказва за всяка от красивите къщи, намиращи се в тази част на града. При всяка от разходките ни най-дълго спирахме пред къщата на ул. Сан Стефано №6 или така наречената „Къща с ягоди”.\n\nКъщата е построена в края на двадесетте години на двадесети век за банкера Димитър Иванов и неговата съпруга Надежда Станкович. Проектирана е от завършилият във Виена и Карлсруе български архитект Георги Кунев.\n\nВъв вътрешната част акцентът пада върху камината от червен мрамор, намираща се в приемния салон. Има и подиум за музиканти, както и кристални стъкла по вътрешните врати. Няколко спални, красиви тераси, голям кабинет и стаи за прислугата. Нищо от мебелировката не е запазено, но се знае, че софиянци от висшето общество по това време, предпочитат мебели от Централна и Западна Европа.\n\nЕкстериорът представлява голям преден двор към улицата, отделен от тротоара с прекрасна ограда от ковано желязо. Тройно стълбище към самия вход на къщата, но винаги много голямо впечатление правят специалните портали за карети и файтони от двете страни на двора. Дори и днес си представям как файтон с членовете на поканеното семейство влиза в двора на къщата през единия портал, кочияшът с конете и файтона остават в отреденото пространство зад къщата, пригодено специално за това, докато изчакват приемът да свърши и пак да излезе от двора, но през другия портал.\n\nСемейството на банкера Иванов е живяло щастливо в къщата, поне до 1944г. След войната имотът е национализиран и първоначално в него се помещава румънското посолство. По-късно през годините къщата е търговско представителство на СССР в България, както и седалище на администрацията на различни комунистически структури с неясно предназначение.\n\nПрез 90-та година къщата е реституирана и върната на наследник на първия собственик-банкерът Димитър Иванов. От 2004г. имотът е собственост на директора на Лукойл-Валентин Златев, който засега не е показал, че има някакво отношение към този паметник на културата. Красивата някога къща се руши от десетилетия и сега навява доста тъжни мисли.\n\nСнимки и текст: https://momichetata.com/gradski-nahodki/kshhata-s-yagodite-posleden-pogled-otvtre-predi-da-ya-demontirat	t	0	42.69552679789627, 23.339572260720637	1	1	2	2022-01-25 10:44:04.184+00	София	1	48	2
60	Парк „Славейковите дъбове“	Оцелели са над 300 години. И до днес хвърлят сянка в застроена София, между улици и блокове, там, където някога е бил краят на града.\r\n\r\nСлавейковите дъбове са особен вид забележителност. Въпреки че са напоени с много история, те не са притегателен център за туристи,  непознати са дори за голяма част от софиянци. Но който почита Пенчо Славейков и за когото „Ралица“ и „Кървава песен“ са не само заглавия, веднъж в годината отива там да се поклони на поета.\r\n\r\nГрадинката с 28-те Славейкови дъба, която се намира на метри от Семинарията, е една от малкото останали зелени площи в кв. „Лозенец”. Тя е последната оцеляла част от старата дъбова кория на София – Курубаглар. Затова 300-годишните дървета са защитени природни обекти. През 1955 г. в „Държавен вестник”  "Дядо Славейковото място и дъбът на Пенчо Славейков" са обявени за паметник на културата, а 50 години по-късно, през 2005 - за паметник на културата с национално значение.\r\n\r\nСемейство Славейкови купува градината, когато след Освобождението, през 1879 г., се премества от Пловдив в София. Тогава теренът е около 10 дка.\r\n\r\nМестността става любимо място за разходка на софиянци по онова време.\r\n\r\nПод сенките на вековните дървета българският кандидат за Нобелова награда за литература Пенчо Славейков написва най-хубавите си стихотворения. В началото на века, подпирайки се на бастуна си, той често идвал от града, сядал под любимия си дъб и се отдавал на съзерцание.\r\n\r\nИменно там е и любимото място на кръга „Мисъл”. Възникнал около едноименното списание, той е първото литературно обединение, което си поставя за цел да формира, насочва и определя литературния вкус на нацията в края на 19. и началото на 20. век. В групата влизат Пенчо Славейков, Пейо Яворов, д-р Кръстьо Кръстев, Петко Тодоров.\r\n\r\nАко можеха дъбовете да разкажат…\r\n\r\nПенчо Славейков умира през май 1912 г. в италианското курортно градче Брунате. В завещанието си поетът пише, че\r\n\r\nиска да бъде погребан до любимия си вековен дъб\r\n\r\nв София, за да остане част от вселената. Желанието му не е изпълнено, но почитателите на Славейковото творчество и до ден днешен се събират на това място в деня на смъртта му, за да почетат паметта на великия поет. А той е толкова влюбен в дъбовете, че възпява желанието си да векува до тях в „Псалом на поета”, написан като писмо до любимата му Мара Белчева.\r\n\r\nТам на високий хълм, където с теб, с другари\r\nобичах да седя в тих разговор унесен,\r\nпоръчай тамо гроб да ми сградят зидари,\r\nтам де мълчанието пей дивната си песен.\r\nТи знаеш, погледи отвърнал от земята,\r\nче аз ги в небеса възйемах все нагоре:\r\nда е и моя гроб възйет към небесата -\r\nи не в пръстта вграден - отвсякъде с прозори.\r\n\r\nНа Славейковата градина се е възхищавал и Иван Вазов:\r\n\r\n„Рътлината Курубаглар въпреки варваризма на името си е едничкото място в околността на София, дето человек може да намери зелен шумалак, сянка и да чуе как шушне гората. Тя е като оазис в тая степна равнина, изгоряла, тъжна, гола като длан лете. Над София тогава постоянно стои един облак прах като дим над бойно поле, който очаква само дъжд или вятър да се пръсне... И говореше ми тая песен на славея за нещо чисто, кротко и нечовешко. И ази чувствувах под омиротворящото й обаяние как изчезват из душата ми облаците, навеяни от вихъра на жизненото зло...” (из разказа „Поколение“).\r\n\r\nПрез 90-те години на миналия век от парка са отделени\r\n\r\n първите парцели, които по закона на реституцията са върнати на собственика им. Апетити към мястото продължава да има и днес. Проблемът идва от това, че при обявяването на градинката за национално значима територията през 1998 г. не е направено предложение за статута й и не е записан необходимият режим за опазването й въпреки изискванията на нормативната уредба. Този пропуск излага градинката на реална опасност от застрояване.\r\n\r\nНеотдавна вековните Славейкови дъбове бяха включени в проекта „Непознатата София”, чиято цел е да припомни на столичани и гостите на града забравени или малко познати исторически, архитектурни, културни и художествени забележителности. Идеята е те да бъдат съживени и по-добре поддържани.\r\n\r\nИзглежда има шанс последната част от старата дъбова кория до бул. „Свети Наум“ да оцелее поне още 300 години.\r\n\r\nАвтор: Таня Иванова\r\nСайт: obekti.bg\r\nСнимки: \r\n	t	0	42.677178508858134, 23.328948629762685	3	1	3	2022-01-25 11:09:34.665+00	София	1	48	2
134	Къкринско ханче	Музеят „Къкринско ханче“ се намира в село Къкрина, община Ловеч, на около 20 минути път с кола източно от областния град. Други по-големи селища и известни обекти в близост са Деветаки и Деветашката пещера, Севлиево и язовир Крапец.\r\nСамото ханче не представлява нищо особено на външен вид. То е една малка стара едноетажна постройка с дворче и нисък плет, обграждащ къщичката. Отвътре ханчето има кухня, хол и спално помещение – пак нищо, отличаващо го от едно обикновено домакинство от периода. В двора на постройката има един вековен бряст, който е бил повален от силна буря в края на миналия век, но след това е преустановен като дърво-паметник с каменна плоча, на която е инкрустирано:\r\n\r\n"Тукъ на 27.XII.1872. год., при зори турски заптии ранили и заловили апостола на свободата ни Левски. Оросено съ кръвьта му, това място говори, че „Тозъ, който падне въ бой за свобода, той не умира!"\r\n\r\nВ момента къкринското ханче функционира като музей. Входът за възрастни е 3 лева, а за ученици и пенсионери – 2 лева. Има и семеен пакет, който струва 6 лева. Обектът е включен и в 100-те национални туристически обекта и на място може да си закупите марка, която да сложите съответно в книжката с обекти.\r\n\r\nКъкринското ханче се свързва със залавянето на Васил Левски от османците. По това време то е функционирало като място за отсядане на членове на революционния комитет. През 1871 година Васил Левски отива в Ловеч и основава революционен комитет, който се разраства изключително бързо. Много скоро става един от най-големите такива структури в България и в него кипи оживена дейност. Чрез ловешкия комитет се разпределят революционни вестници и новини из страната. Идеята на Апостола е била да подготви цяла България за всеобщо въстание отвътре, а не от съседна Румъния. През 1872 година обаче Димитър Общи бива заловен от турците при опит да обере турската поща при проход Арабаконак. За да не го обесят, той издава всичко, което знае за революционните комитети и Левски. Османците се организират и започват масово търсене на Апостола. Научил за провала, Левски минава през Ловеч, за да прибере документацията от ловешкия комитет и, придружен от местния Никола Цвятков, потегля за Румъния през Търново. На път за Търново, следобед на 26 декември го спират турски заптиета при Пази мост. Апостола е пременен и османците не го познават. Левски си продължава по пътя. След полицейската проверка стига при Къкрина вечерта, яде и ляга да спи. През това време турците правят случайна проверка на ханчето, за която до ден-днешен се спекулира дали е била случайна или не. Обкръжават обекта, докато Левски спи. Апостола се събужда и чува, че е обграден. Той се опитва да избяга от задния вход, но турците стрелят и при прескачането на плета го раняват. След това бързо се нахвърлят върху него, залавят го и го връщат в Ловеч, където е разпознат. Скоро след това той бива съден в София. В крайна сметка е осъден на смърт чрез обесване и на 18-19 февруари 1873 година в покрайнините на София, Апостола на свободата бива обесен.\r\n\r\n\r\nВ днешно време на 19 февруари се провежда ежегодният поход „По пътя на Левски“. Тази традиция бележи своето начало през 1968 година.\r\n\r\nСнимки и текст:http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/kakrinsko-hanche/	t	0	43.124438,24.884491	1	2	3	2022-04-12 06:54:32.032+00	Ловеч	1	48	0
62	Къща музей „Панчо Владигеров“	Държавният културен институт къща музей „Панчо Владигеров” се помещава във фамилната къща на композитора, дарена на българската държава чрез Дарителския фонд “13 века България” от съпругата Елка Владигерова и от внука Панчо Владигеров – младши, с изричната воля – за устройването на музей.\n\nИзвадка от завещанието на Панчо Владигеров:\n\n„…В случай, че държавата направи музей от обитаваната от мен и съпругата част от къщата, моята воля е: съпругата ми Елка Владигерова да остане да живее в нея докато е жива и да й се възложи да бъде уредник и пазител на този музей.\n\nМоята воля е също: всички мои авторски ръкописи, както и всички мои печатани творби, всички мои ноти и партитури, всички мои грамофонни плочи, магнетофонни ленти, както и целия ми архив, състоящ се от писма и най-различни други документи, да останат в дома ми, независимо от това кога той ще бъде превърнат в музей.\n\nЗавещанието правя по моя собствена свободна воля.“\n\nСофия, 29 ноември 1976\nЗавещател:\nПроф. Панчо Хараланов Владигеров\n\nПостоянната експозиция на къщата музей е открита на 25 март 2005 г. Тя се помещава в дарената част от къщата и включва документална експозиция с акценти за живота и творчеството на Панчо Владигеров и автентична възстановка на работния кабинет на композитора и на любимия му кът за отдих.\n\nДокументалната експозиция е ситуирана в най-голямото помещение на дома – гостната на семейство Владигерови. Тя включва шест вертикални пана и четири обемни витрини, проследяващи в хронологичен план най-важните етапи в живота и творчеството на Владигеров.\n\nОсновни теми в експозицията са:\n-Родно място, семейна среда, детство\n-Образование в Германия и ранно творчество\n-Първи признания за младия композитор\n-Утвърждаване на композитора. Върхови постижения на младия творчески гений\n-Сценична музика. Работата на Владигеров в творчески тандем с големия немски режисьор Макс Райнхард\n-Мащабни сценични платна. Опера, балет\n-Години на творческа и изпълнителска зрялост\n-Международна концертна и обществена дейност. Любим учител и педагог\n-Последни години на активно творчество, висока оценка и признание на композитора\nЦентър на експозицията е оригиналният авторов ръкопис на Рапсодия “Вардар” – най-популярното, най-обичаното и изпълнявано произведение на твореца, наложило се като химн на българската музика.\n\nВъв фонда на къща музей „Панчо Владигеров“ се съхраняват близо 7000 /седем хиляди/ архивни единици, обособени в следните сбирки:\n-ръкописи\n-оркестрови материали\n-афиши, програми и снимки\n-личен архив и кореспонденция\n-лична библиотека, фонотека и нототека\n-лични вещи\nСъдържанието на архива и знаците, които той носи, говорят за изключително старателното и педантично събиране и подреждане на материалите от самия Владигеров. С чувство на себеуважение и уважение към изкуството, на което се е посветил, както и с голямата отговорност на творец, осъзнаващ мисията, която е призван да носи, Маестрото запазва всичко, което е свързано с неговото творчество, с изпълнителското изкуство, с обществената и педагогическата му дейност.\n\nВ интериора на документалната експозиция са вписани рояла „Schwechten“ и пианото на Владигеров, марка “Steinway”, чудесен концертен инструмент, който се ползва за камерни концерти, майсторски класове и др. Художествените портрети на братя Владигерови и на майката на композитора, Елиза Пастернак-Владигерова, допълват атмосферата на домашен уют и топлина.\n\nВ съседство на документалната експозиция е запазен и възстановен любимия кът за отдих на композитора. Остъклената веранда с френски прозорци, обзаведена в битов народен стил, създава настроение, внася колорит и е един плавен преход към зеленината на градината.\n\nРаботният кабинет на Владигеров е възстановен в автентичен вид, така както го е оставил композитора. В неголямата стая е роялът, работната маса с неизменните гума и моливи, любимият фатерщул и една уникална сбирка от снимки в рамки, окачени по стените, от които ни гледат познати лица на композитори, диригенти, пианисти, цигулари, певци, лични и творчески приятели на Владигеров.\n\nПовечето от фотографиите са с автографи. Тази колекция, събирана повече от 60 години, непрекъснато допълвана и обогатявана, създава неповторима атмосфера на духовно общуване с композитора.\n\nВходни такси:\n\nУчащи и пенсионери – 2 лв.                                                                                                                                                        \nГраждани – 3 лв.\nБеседа – 5 лв.\n\n\nТекст от: https://vladigerov.org/\nСнимки от: https://www.facebook.com/vladigerov.org	t	0	42.67237491282478, 23.328467826857523	1	2	3	2022-01-29 16:41:44.961+00	София	1	48	28
84	Червената перла на Леге	Тази сграда може да се похвали с прекрасно декорирана фасада. Релефни колони с ефектни капители са разположени симетрично между прозорците на първия и втория етаж, разделени с красив фриз с флорални елементи. Масивен корниз отделя втория от третия етаж, а характерният балкон с парапети от ковано желязо на втория етаж е прекрасен.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/354	t	0	42.69498259896689, 23.323623387735395	1	1	2	2022-01-30 14:15:49.414+00	София	1	48	17
143	Екопътека Трънско ждрело	Трънската екопътека, минаваща покрай ждрелото на река Ерма, е едно истинско еднодневно приключение, включващо необикновени изживявания и смайващи гледки. Пътеката започва от обособен паркинг, където има и места за хапване и отдих. Високо пред вас ще видите двата гигантски скални блока – Църквище и Жилав камък. Всъщност именно между тях минава река Ерма, образувайки най-живописната част от Трънското ждрело. Милиони години ерозионна дейност са били необходими за формирането на този природен феномен.\r\n\r\nТой е впечатлявал природните ценители още през 19-ти век. Самият Алеко Константинов описва Трънското ждрело в своя пътепис „Какво? Швейцария ли?…“\r\n\r\nПътеката е първоначално равна, но изведнъж се спуска стремглаво надолу. Бученето на реката под вас, комбинирано с издигащите се скални късове наоколо е внушително. С помощта на дървени мостчета и парапети се минава над реката и се излиза в подножието на скалата Жилав камък. След стръмно изкачване пред вас ще се покаже входа на тунел. Той е изкуствено създаден от немците по времето на Втората световна война, като е служел за съхранение на боеприпаси. Имало е идея да послужи и като път за теснолинейна влакова линия, но този проект си е останал неосъществен. Въпреки това, тунелът е приятен за минаване, а за ценители може да се нарече дори красив. От тунела нататък пътеката се заравнява за следващите 30-тина минути, върви се покрай широколистна гора. След като изминете тази част, ще стигнете до разклон. Вляво надолу е към Рибарника и панорамната площадка Църквище, а направо пътят продължава към доста по-далечни дестинации – Врабчански водопади, връх Драговски камък и др. (има табели). Продължението на Трънската екопътека обаче е вляво към Рибарника. След като подминете няколко вили, ще се озовете на дървен мост, след който ще видите Рибарника. Има ресторант, където може човек да седне и да хапне прясна риба и други деликатеси.\r\n\r\nПътеката, водеща към панорамната площадка Църквище, продължава вдясно от Рибарника, нагоре в гората. Следват участъци с по-сериозно изкачване, които се минават за малко над 30 минути. Излиза се на една беседка, а пътеката на ляво от нея води към панорамната площадка. Ние поехме по нея и след 2-3 минути се озовахме на съвсем открит участък, откъдето се виждаха двата грамадни скални блока от самото начало на пътеката. С удивление осъзнахме, че панорамната площадка, към която сме се запътили, се намира точно на върха на единия (Църквище). Поехме нагоре, а скалата изглеждаше все по-застрашително. И действително изкачването по нея си е доста стръмно, но за щастие има приспособени дървени парапети, които доста помагат. С немалка доза внимание и пот се качихме на Църквището, а отгоре гледката наистина си струваше усилията. Отсреща Жилав камък, отдолу бучащата река, а наоколо заобикалящите планини от Краището. Неописуемо!\r\n\r\nВръщаме се обратно до беседката и оттам продължаваме вляво и надолу. След 10-20 метра има пътека вляво, която е по-къса, но и доста по-стръмна. Тя води обратно до паркинга. Може да се мине и по пътя пред вас, който заобикаля, но пък е сравнително равен. Който и да изберете, ще се озовете обратно на началната точка и така ще затворите маршрутния кръг около река Ерма. Страхотно преживяване!\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/trunsko-zhdrelo/	t	0	42.861449,22.649737,10z/	3	1	3	2022-04-12 07:36:01.432+00	Трън	1	48	0
67	Музикален подлез	Всеки ден в подлеза под бул. “Цариградско шосе” и ул. “Александър Жендов” се чуваше музика. Китара, саксофон, акордеон… Явно това място беше предпочитано от уличните музиканти. Веднъж се спрях увлечена от красивата мелодия на саксофона и поисках да разбера историята на музиканта. Той ми разказа за себе си, за своята музика и за подлеза, в който навремето имало рок бар, който той много обичал. Мъжът седеше на мръсно ръбче в една от нишите на подлеза. Стана ми тъжно…\n\nНо екипът на “ПОдЛЕЗНО” не вижда проблеми, а само потенциал. 🙂 Заловихме се за работа и създадохме първия “Музикален подлез” в България с пейки за уличните музиканти, музикални графити и стълбища като пиано. Организирахме и кампания за “рециклиране” (повторно използване) на стари касетки и дискове, но не очаквахме да стане толкова мащабна – получавахме колети от различни краища на България и дори грамофонни плочи. От дисковете и касетките направихме пана, а лентата използвахме да изобразим къдравата коса на Джими Хендрикс. Предвидили сме и забавление за по-талантливите минувачи – ръчно изработен музикален инструмент “Оргафон” – направен от водопроводни тръби, на който можете да свирите с джапанки или… кредитна карта. 😀 Ако не вярвате – вижте видеото на барабаниста Димитър Господинов, който изпълнява своята авторска песен “Лято” на уникалния инструмент.\n\n\nПроектът се финансира от “Фонд за иновации в културата” (администриран от Асоциация за развитие на София), “Електра помп” и “SebaKMT – част от Megger group” .\n\nФондът спечели престижното признание на Европейската комисия за добър пример за фонд с публично-частно финансиране в областта на културата и имахме възможността да представим проекта за Музикален подлез пред делегати от 10 европейски страни.\n\nИстории из подлезните пространства: Един работен ден в подлеза, случайно мина мъж с двете си 5-6 годишни деца. Той явно видя възможност да възпита у децата си ценности като доброволчество, трудолюбие и алтруизъм, защото веднага поиска кофа и парцали за себе си и за децата и тримата започнаха да помагат усърдно с почистването на подлеза.\n\nТекст и снимки: https://podlezno.org/muzikalen-podlez/	t	0	42.6775075480817, 23.35591655223552	4	1	3	2022-01-29 20:28:16.708+00	София	1	48	42
141	Етнографски комплекс „Дядо Йоцо“	По криволичещия път за село Очиндол ще забележите една значително голяма статуя, която се издига над Искърското дефиле и гледа живописната природа от високо. Това е паметникът на дядо Йоцо, който се намира в едноименния етнографския комплекс. В комплекса също има и механа, където готвят вкусни български ястия, и голяма беседка, която разкрива панорамна гледка към Искърското дефиле. А до беседката има и къса екопътека, която е перфектна за разходка.\r\n\r\nМястото е направено през 2005 година, като идеята за издигането на паметника е на Огнян Петров, а проектът за самия паметник е дело на Георги Тишков и Моника Игаренска. Самият паметник е висок 5 метра и тежи 11 тона, и е направен от бял врачански камък. Впечатляващи са размерите на тази скулптура, които са въплъщение на монументалността на Вазовата литература и запазват спомена за този велик българин. Друга такава статуя в България няма никъде. Паметникът представлява фигурата на дядо Йоцо, гледайки към Искърското дефиле и железницата, която сега минава по маршрута София-Мездра.\r\nХората от близкото село се гордеят с този проект и казват, че самият Иван Вазов често отсядал по селата в дефилето. Там се предполага, че авторът се е вдъхновил да напише разказа „Дядо Йоцо гледа“. Поставянето на тази скулптура на входа за Очиндол приветливо посреща гостите на селото и съхранява духа на българското.\r\nМястото може да бъде посетено по всяко време на годината, но най-интересно е да се отиде и на ежегодния национален фолклорен събор – „Де е българското“. Той се пада края на май месец или началото на юни в Неделята на слепия. На този събор се дава и една специална награда за родолюбие.\r\nДнес много хора спират там, за да се насладят на красивата гледка и да погледат България от високо. С помощта на община Мездра и други дарители е създадено това уютно кътче в полите на Врачанския балкан. Не много хора знаят за това интересно местенце, но то е прекрасно за разходки и отдих. В близост до комплекса има много туристически маршрути, като например този от село Очиндол до хижа Пършевица.\r\nДо там е най-удобно да се стигне с кола. Пътят към селото е изпълнен с резки завои, а красивата местна растителност обгръща пътя и от двете страни. Комплексът разполага с паркинг, но за тези, които се наслаждават на походите има и екопътека.\r\n\r\n\r\nНачалото на пътеката „Горски кът“ се намира от другата страна на паркинга и не след дълго води до друга беседка. Ако обаче предпочитате дългите разходки и походи, може да стигнете до местността и с влак, а след това да поемете по някоя от пътеките, водещи до горе.\r\n\r\n\r\nАко обаче сте фенове на дългите разходки и предпочитате да стигнете до там пеша, ще трябва да вземете влак до ЖП станция “Левище”. Оттам може да поемете по пътеките до река Искър, след което да излезете на асфалтовия път, който води до село Очиндол. Пътят от гарата до комплекса е само 2 километра, но разходката си заслужава заради магическата гледка към Искърското дефиле.\r\nВ близост се намира и Младежкият еко лагер на село Очиндол, от където може да поемете по Наследствената екопътека, която разказва историята на селото. Маршрутът й е кръгов, а самата пътека е лесна за изхождане. Маршрутът е доста кратък – само 3 километра, но в същото време разкрива красивата природа на Врачанския балкан. На пътеката има множество информационни табели, които разказват за културата, историята и обичаите на селото, и други, които съдържат информация за флората и фауната на района.\r\nПаметникът на дядо Йоцо е проектиран да гледа към свободна България и така той увековечава героя от Вазовия разказ „Дядо Йоцо гледа“. Сам по себе си проектът е велико дело, защото олицетворява могъществото на българския дух. Както вече споменах, малко хора знаят за това чудно място, но то трябва да бъде посетено от всеки, който се гордее с българското.\r\n\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/kompleks-dyado-iotso/	t	0	43.078966,23.459948,10z	3	1	3	2022-04-12 07:29:36.58+00	Враца	1	48	2
63	Захарната фабрика	Сградата на Захарна фабрика в София е една красавица, която си отива. По-скоро една бивша красавица, която се е превърнала в грозно чудовище някъде там в периферията на столицата. Руините на някогашната Захарна фабрика все още се водят паметник на културата от национално значение, но тя отдавна е място, което буди само страх и тревога. Хората от квартала, който носи нейното име, минават на прибежки покрай нея дори и по светло. И мръкне ли, гледат да са вкъщи. Защото районът е царство на местните роми, които ходят на тумби и спазват свои правила.\n\nИменно мургавите, разказват местните, са физическите палачи на красавицата – рушат я упорито и методично. Зиме свалят дървените й греди, за да си палят печките, лете – железните арматури. Продължават и въпреки нещастния случай отпреди шест години, когато баща и син роми загинаха под руините. Не се спират и пред охраната. А тя и няма право да е въоръжена.\n\nСградата на Захарна фабрика е построена през 1898 година от белгийската компания Солвей. Тя е открита в присъствието на цар Фердинанд I. За времето си е най-голямото промишлено предприятие в страната.\n\nЗа значението, което е имала фабриката за страната, говори и фактът, че белгийските инвеститори са получили от българското правителство 10-годишна концесия за отглеждане на захарно цвекло. Получили и други преференции като освобождаване от някои данъци и от мита за внасяното оборудване, отстъпки за превозите с БДЖ и др.\n\nФабриката е била със сезонна натовареност и през активния период в нея са работели до 1200 души. Капацитетът й е бил 7 хиляди тона рафинирана захар годишно, а пазарният й дял достигал до 20%.\n\nБелгийците продават бизнеса си около 1916 година и напускат страната – след влизането на България в Първата световна война. След 1989 година сградата не спира да сменя собствеността си. През 2009 г., когато става трагичният инцидент в нея, собственик е гръцката компания Ти Ей Би Риъл Естейт ЕООД. Според хората в района гърците са си тръгнали, а на въпроса кой е новият собственик вдигат рамене.\n\nМестните обаче подозират, че който и да е собственикът, той не иска да запази сградата. Дори напротив. "Това е огромно пространство, приготвено е за нещо", казва мъж, който се представя като Добри. Негов приятел добавя, че се носят слухове, че мостът на фабриката ще се прави на магистрала и всичко в района ще бъде махнато. "Не вярвам", отвръща Добри и залага на бизнесцентър или мол.\n\nИ те, и други хора в района, смятат, че новият собственик умишлено оставя ромите да разграбят сградата, защото като паметник на културата тя е защитена от закона и не може да бъде съборена. "Няма как да вкараш багер и да рушиш", казва Добри.\n\n\nПрочети още на: https://www.dnes.bg/redakcia/2015/05/19/zaharna-fabrika-edna-krasavica-na-sofiia-koiato-si-otiva.263986\n\nПрочети още на: https://www.dnes.bg/redakcia/2015/05/19/zaharna-fabrika-edna-krasavica-na-sofiia-koiato-si-otiva.263986\n\nПрочети още на: https://www.dnes.bg/redakcia/2015/05/19/zaharna-fabrika-edna-krasavica-na-sofiia-koiato-si-otiva.263986\n\nПрочети още на: https://www.dnes.bg/redakcia/2015/05/19/zaharna-fabrika-edna-krasavica-na-sofiia-koiato-si-otiva.263986\n	t	0	42.71716562999944, 23.295075769881	1	1	5	2022-01-29 16:55:14.223+00	София	3	48	8
65	Улица Леге	„Леандър Леге“ е централна улица в София.\n\nРазположена е в район „Средец“. Наречена е на френския дипломат Леандър Леге. Простира се между ул. „Алабин“ и бул. „Цар Освободител“. На нея има много исторически снимки и тя е свидетел на стара София. На улицата мжое да се види Министерстотово на икономиката, Висшия съдебен съвет, Ротонда „Свети Георги Победоносец“ и други.\n\nЧаст от текста/снимки: https://bg.wikipedia.org/wiki/Леге_(улица_в_София)	t	0	42.695377221142266, 23.32366042947556	6	1	2	2022-01-29 19:44:32.509+00	София	1	48	3
66	„За хвърчащите хора" монументален стенопис	Монументална стенопис на две фасади (под пръв ъгъл) на жилищен блок. На източната фасада е изписано и стихотворенето „За хвърчащите хора” на големия поет и творец Валери Петров. Urban Creatures - Момичето с птичката и цветето.\nАвторът споделя за своята творба в интервю от 4.9.2014 г. – „... ние тука показваме едно момиче, което досега е вземало, но сега, в момента, иска да почне да дава. И на кого да даде? Първо душата се опитва да удовлетвори свръхдушата. Опитва се да даде едно цвете на бога в благодарност към него. Птичката всъщнот е свръхдушата, която живее в сърцето на всеки... Точно това послание е и връзка с „хвърчащите хора” на Валери Петров.” Питам Насимо кои са те... и той посочва именно тези, които са се освободили от веригите на материалната природа. Егоизмът според него няма нищо общо със свободата. Той е само опит да избягаш от действителността. Истински свободен според Станислав е този, който служи на останалите, без да очаква нищо. Просто като част от цялото. „Валери Петров говори за хвърчащите хора, защото те съществуват, но ние не им обръщаме внимание.”\n\nЗа хвърчащите хора\n\nТе не идат от космоса,\nте родени са тук, но сърцата им просто\nса по-кристални от звук, и виж, ето ги – литват\nнад балкони с пране, над калта, над сгурията в\nдвора, и добре, че се срещат единици поне от рода\nна хвърчащите хора.\n\nА ний бутаме някак си и жени ни влекат, а ний\nпием коняка си в битов някакъв кът и говорим\nза глупости, важно вирейки нос, или с израз на мъдра\nумора и изобщо - стараем се да не става\nвъпрос за рода на хвърчащите хора.\n\nИ е верно, че те не са от реалния свят,\nне се срещат на тениса, нямат собствен\n„Фиат“. Но защо ли тогава нещо тук ни\nболи, щом ги видим да литват в простора –\nда не би да ни спомнят, че и ний сме били\nот рода на хвърчащите хора?\n\nВалери Петров (22.04.1920-27.08.2014)\nЗабележка: Изписаният на стенописта текст на стихотворението е с променена куплетна форма и две думи „рода” вместо оригиналното „вида” и „важна”, вместо „снобска”.\n\nТекст: https://registersofia.bg/index.php?view=monument&option=com_monuments&formdata[id]=1117&Itemid=140	t	0	42.709951133984156, 23.35392769620892	4	1	2	2022-01-29 19:51:30.406+00	София	1	48	3
135	Акве Калиде	„Акве Калиде“ е разположен в бургаския извънградски квартал Ветрен. Намиращ се в близост до разклона за пътя по магистрала „Тракия“, мястото е удобна спирка за отдих и е едно от местата, на което се събират културата и историята на древните гърци, римляни, българи и византийци.\r\nИмето „Акве Калиде“ произлиза от гръцки и означава „горещи води“. Според гръцката митология, Нимфите-потомки на Океана и Тетида, били покровителки на изворите и на цялата природа.\r\n\r\nБроят на Нимфите надвишавал 3000 като някои от тях били пазителки на солените води – Океаниди, а други пазели сладките води – Наяди. Пазените от тях извори се считали за лечебни, като те често дарявали с вечна младост и безсмъртие. Според легендата, три от нимфите били пазителки на лечебните минерални води край древния град Акве калиде. Те обаче отказали да опазят чистотата на извора и в отговор на тяхното своеволие били вкаменени от боговете. Още през I хил. пр. Хр. Светилището на Трите нимфи до горещите минерални извори се считало за свещено място от траките.\r\n\r\nВ средата на I в. сл. Хр. Римската империя създала провинцията Тракия. Обществените бани заемали съществена роля в ежедневието на римските граждани за „здрав дух в здраво тяло“. По време на управлението на император Траян през II в. сл. Хр. активно се изграждат обществени бани и пътища, като в близост до Акве калиде също е построена пътна станция. По-късно тук император Септимий Север организира специални тържества и спортни игри, наричани „Северия Нимфеа“. През VI век византийската императрица Анастасия, съпруга на император Тиберий II, също била успешно излекувана в Термопол. В знак на своята благодарност тя подарила императорската си мантия на местната църква. При нахлуването на аварите, предвождани от Баян, те отседнали в лековитите минерални бани. По молба на жените си от харема, Баян не разрушил баните. Аварите намерили пурпурната мантия на императрицата, а Баян се наметнал с нея и се провъзгласил за император на ромеите.\r\n\r\nЛечебните извори на Акве калиде играят важна роля и в създаването на Първата българска държава. През пролетта на 680 г. византийският император Константин IV организира мащабен поход срещу укрепените в Онгъла българи на хан Аспарух. Преди решителното сражение обаче, императорът се наложило да се оттегли, под предлог че ще се лекува от подагра. Предполага се, че Константин IV се насочил именно към изворите на Акве калиде, тъй като те се използвали за облекчаването и лечението на това заболяване. След създаването на Българската държава градът бива прекръстен на Терма или Термополис.\r\nЗа дълго време след опожаряването от Кръстоносните походи, минералните бани останали в руини. През 16-ти век на това място султан Сюлейман I Великолепни изгражда върху полуразрушените бани постройка. Новата баня се наричала Капладжа хамам, а тук Сюлейман Великолепни се лекувал от подагра. В знак на благодарност за успешното лечение, султанът издал ферман, с който богато надарил района и осигурил неговото икономическото развитие.\r\n\r\nРимските бани са достъпни за туристите чрез пасарелки, а банята на Сюлейман е напълно възстановена, като запазва оригиналната визия с мрамор и ориенталска керамика. Тя играе ролята на действащ музей, в който посетителите могат да отидат на 3D разходка през историята още от времето на траките. Комплексът включва и кафе, магазин за сувенири, а до него се намират множество ресторанти и парк „Минерални бани“, оборудван с места за пикник и тухлени пещи за барбекю.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/akve-kalide/\r\n	t	0	42.613012,27.3929	1	2	3	2022-04-12 07:00:38.225+00	Бургас	1	48	3
72	Лекарска стена	Екипът на фондация ПОдЛЕЗНО се създаде през далечната 2013 г., когато всички ние бяхме неопитни студенти и мечтатели. Нашият опит показа, че са нужни визия, смелост и упоритост, за да постигнеш много в живота и винаги сме се стремяли да вдъхновяваме и да помагаме на други младежи да разгърнат потенциала си, да пробват нещо ново, да придобият опит и да превръщат мечтите си в реалност. За нас беше голяма радост, че група ученици от 51 СУ “Елисавета Багряна”, гр. София решиха да дебютират в сферата на градското изкуство и стенописите с наша помощ.\n\nТака се роди проект “проСТРАНСТВАМЕ”, в който “странстващите” таланти обикалят няколко населени места в страната, за да рисуват различни пространства. Обединяващата тема е “Живот”, разгърната в три различни пространства:\n\nподлез, олицетворяващ дълбините под морското равнище, където е възникнал самият живот;\nмост, метафора за живота на повърхността и свързаността на всички живи същества и\nстена на болнична ограда, където всеки ден лекари се борят за човешкия живот.\nБолницата не е случайно избрана – СБАЛ по паразитни и инфекциозни болести „Проф. Иван Киров“ в район Триадица, Столична община. В условията на световна пандемия всеки се замисля за цената на живота, а изкуството ни помага в трудни времена и въздейства на сетивата ни. Чрез Лекарската стена изразяваме благодарност към медиците на първа линия в борбата срещу Covid-19 и отправяме призив към хората да се пазим един друг и да бъдем по-човечни.\n\nТекст и снимки: https://podlezno.org/lekarska-stena/	t	0	42.68087450317791, 23.303450095953036	4	1	3	2022-01-29 20:59:31.926+00	София	1	48	3
139	Ендемично поле в природен резерват „Острица“	В планината Голо бърдо около връх Острица можем да посетим една от най-старите защитени природни територии в България, а именно природния резерват „Острица“. Там можете да откриете нещо уникално за страната ни – ендемично поле.\r\nГоло бърдо е ниска планина, изградена от дълбоко окарстени варовици, пясъчници и конгломерати, а на върха ѝ е разположен участък от няколкостотин квадратни метра, покрити с растителни видове, които са изключително редки за българската флора.\r\n\r\nВъпреки че южните склонове са основно засипани с камъни, по останалата част на планината растат над 300 вида растения. Само 40 от тях са дървета или храсти. Всички останали са треви и именно в тях се състои скритото богатство на „Острица“. Те оформят един истински остров на редки тревни растения от Европа, Азия и Африка!\r\n\r\n\r\nСред тези растения се срещат и български ендемити. Това са живи организми, които може да се срещнат единствено по българските земи. Всички сме гледали научнофантастични филми и след като посетите природния резерват, идеята за огромни кръвожадни орхидеи, които поглъщат и убиват хора, няма да ви се струва толкова въображаема. Такива видове са съществували и все още съществуват в някои скрити кътчета. Посещавайки ендемичното поле в Голо бърдо, можете да видите хищни растения, макар и да със значително по-малки размери. Съществуват теории, че тези видове са били с по-впечатляваща големина, но постепенно са станали по-дребни. Начинът им на хранене обаче остава непроменен: растението отваря своя ярък цвят и изчаква жертвата сама да влезе, след това я затваря вътре и я отравя.\r\n\r\n\r\nНякои от българските ендемити, на които можете да се насладите, са урумово лале, урумов лопен, хибридно плюскавиче и българско карамфилче. В природния резерват „Острица“ има и доста видове, високо ценени на Балканите, като райхенбаховата перуника, главестата жълтуга, дланолистен ветрогон и скален равнец. А поради варовитите почви в Голо бърдо мястото е и чудесен развъдник за „варовикови“ видове, сред които са дивия зюмбюл, пролетния горицвет, точковото гологлавче, омразничето и обикновения люляк. Не само флората, но и фауната на местността е впечатляваща. Тук можете да срещнете степни гущери, пеперуди, диви пчели и мравки. В това кътче на България обитават дори и карпатски скорпиони. Всички тези видове са изключително редки и ценни за науката.\r\nПрез 1936 г. българските ботаници академик Николай Стоянов и д-р Борис Ахтаров открили местността и я определили като „ботаническото Елдорадо“ на България. Те не пропуснали да отбележат и факта, че периодът на цъфтеж в „Острица“ трае между 10 и 11 месеца, продължавайки от края на зимата чак до късна есен. Тази специфична особеност е породена от климатичните условия в Голо бърдо и позволява на посетителите да се любуват на природния резерват почти целогодишно.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/ostrica/	t	0	42.546519,23.047996,8z	3	1	4	2022-04-12 07:20:38.236+00	Перник	1	48	0
80	Синята къща с верандата	В малка странична уличка на София, обвита от зеленина, се намира тази малка синя къща с интересно оформление и още по интересна бяла дървена веранда, която времето не е пощадило.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/179	t	0	42.700122913569324, 23.341454480987064	1	1	2	2022-01-30 13:48:08.053+00	София	1	48	27
167	Етрополски водопад	Етрополският водопад, наричан Варовитец, се намира близко до Етрополския манастир.\r\n\r\nВодопадът се образува от малка река, протичаща покрай манастира, която се спуска по карстов откос. Когато човек види извора, не може да си представи, че малко по-надолу има такъв красив и живописен водопад. Интересното е, че изворът на реката е само на 300 – 400 метра по-нагоре и тя изглежда като малко поточе. Малко преди водопада има по-малко каменно корито. Каменното корито е широко 50 – 60 см и дълбочината в него е едва 10 – 15 сантиметра.\r\n\r\nДо 1970-те години в края на каменното корито е имало водно колело, което е задвижвало генератор за електрически ток, захранващ манастира.\r\n\r\nВодопадът е заобиколен от красиви растения и дървета.\r\nСнимки и текст: https://bg.wikipedia.org/wiki/Етрополски_водопад	t	0	42.8244514314969, 24.038870942233316	3	1	3	2022-04-12 16:11:05.151+00	Етрополе	2	48	1
144	Читалня „Книги в облаците“	Високо из планинските небосклони човек може да се наслади на магията на българската природа и чистия въздух, но хижа Плевен съчетава всичко това с още една наслада за духа – книгите. Намираща се на 1504 метра надморска височина, читалнята „Книги в облаците“ е неповторимо място за отдих и възможност за едновременно потопяване в света на литературата и в заобикалящата природа. В миналото залата е функционирала като ски гардероб, а след ремонти на 15 декември 2019 се е състояло официалното откриване на библиотеката. Мястото е чисто ново и перфектно реновирано. Това е и единствената по рода си читалня „в облаците“.\r\n\r\nВътре в библиотеката ще откриете десетки книги, разделени по категория и изложени по рафтовете на стените. Всеки посетител може да занесе своя книга по желание и да я прибави към колекцията на хижата. Мястото дължи уюта си не само на красивите книги, а и на множеството столчета, дивани, фотьойли, масички и одеяла, които са поставени там за комфорта на посетителя. Освен това има пиано, китара и акордеон, на които гостите-музиканти на хижата могат да посвирят. Гледката от прозорците на библиотеката са наистина внушителни – Централния Балкан се извисява над вас, а близо 900 метра отвесно нагоре с червено-бялата кулата се откроява старопланинския първенец Ботев (2376 метра).\r\n\r\nНаистина не мога да ви опиша магията, която се крие в това място. Думите не са достатъчни. Но ще се опитам да ви разкажа. Ние посетихме хижа Плевен за една нощувка – беше късна августовска вечер. Бяхме чували за библиотеката и искахме да я разгледаме, така че след вечеря слязохме по външните стълби от столовата и тихо открехнахме вратата на читалнята. Библиотеката беше празна. Намерихме ключа за лампите и светнахме. В захлас разгледахме всичките жанрове книги, не знаейки коя по-напред да захванем да разгледаме. Една специална книга обаче ми хвана окото. При категорията „криминални романи“ видях книжката „Истории, докосващи сърцето“ (все още не ми е съвсем ясно книгата защо беше поставена при този жанр, но впоследствие аз прилежно я върнах там, където я бях намерила). Книжката се оказа сборник с притчи, събрани от най-различни автори. И наистина имаше някои много красиви. Даже бих казала, че „докоснаха“ сърцето. (Личен фаворит ми остана „Тайната на семейното щастие“.)\r\n\r\nПочетохме малко в библиотеката, но беше топла и красива лятна нощ и решихме да вземем книгата за отвън. Зад основната сграда на хижата има поляна (водеща до по-малката сграда), на която са разпръснати сгъваеми столчета. Настанихме се на тях и седнахме под звездното небе. А звездите как се виждаха! Погледнати от планинските склонове, тези пламтящи топки газ бяха безкрайно много. Никога не бях виждала толкова звезди наведнъж! И всяка блещукаше из черното небе. Всяка на милиони светлинни години от нас, но сякаш можех да ги докосна. Нямаше нито един облак тази лятна нощ (иронично с оглед името на читалнята) и се падаше точно през периода на лятото, когато метеорният поток Персеиди се наблюдаваше най-ясно. Освен магията на природата и литературата, тези падащи искри в небето превърнаха вечерта ми в истински сюрреалистичен романс.\r\nИ там, в сърцето на Балкана, ние седнахме с едно фенерче, шепнейки си притчите от книгата. А падащите звезди ни правеха компания, разсичайки кроткия небосклон със своите огнени дири. Една незабравима нощ.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/knigi-v-oblatsite/	t	0	42.749683,24.895491	1	1	3	2022-04-12 07:38:57.813+00	Плевен	1	48	2
61	Музеят на социалистическото изкуство	Музеят на изкуството от периода на социализма е открит на 19 септември 2011. В него се представят произведения от периода на социалистическото управление в България (1944-1989). В парк с площ от 7 500 кв.м са изложени над 70 творби на монументалната скулптура. На специален постамент е експонирана голямата петолъчна звезда, увенчавала бившия Партиен дом в центъра на София. В зала с площ от 550 кв.м временни изложби на сюжетно-тематичен принцип показват идеологическите форми на изкуството. Във видео зала се прожектират архивни и документални филми. Магазинът предлага каталози и разнообразни рекламни материали и сувенири.\n\nБилетът е 6лв., а за ученици 3 лв. В четвъртък цената е 2 лв. Касата работи до 17:30/\n\nТекст и информация от: https://nationalgallery.bg/bg/visiting/museum-of-socialist-period/\nСнимки: Wikipedia, chernomorie-bg.com	t	0	42.66637852838548, 23.35788017693894	4	2	3	2022-01-29 16:26:23.962+00	София	1	48	2
71	Спортен подлез	Спортът е тема, която искахме да засегнем в нашите проекти още от самото създаване на ПОдЛЕЗНО през 2013 г. Но, ние обичаме да обвързваме проектите си както с околната среда, така и с определени събития и решихме, че е най-подходящо да създадем Спортния подлез през 2018 г., когато София е Европейска столица на спорта.\n\nВсеки, запознат с работата ни, ще забележи, че локацията е необичайна – подлезът на бул. Васил Левски и бул. Гурко е централен, оживен и пълен с магазини. Но избрахме тази локация заради настоятелните молби на една служителка в Министерството на младежта и спорта. Получихме подкрепата на Столична община и приятелите ни от район Средец и се запознахме с Анатоли Илиев и страхотния екип на фондация София 2018, които ни помогнаха да изготвим концепцията за “Младите български шампиони” и да популяризираме проекта сред обществото.\n\nПодлезът е посветен на млади български спортни таланти, които са пожънали международни успехи в съответните си спортове през 2018 г. Изобразили сме фигурите на спортистите в движение, илюстриращо спорта и сме добавили интересна информация за постиженията на българи в съответния спорт на световно ниво. Фигурите са изобразени по снимки на български фотографи, за интерпретацията на които те любезно ни предоставиха правата.\n\nВ допълнение към графитите, ние се постарахме да обогатим пространството с пейки, и табли за шах и за дама, за да се обособи един кът са тихи игри, събития и събирания на хора от всички възрасти, който нарекохме “Спортна среща”. В него има условия за провеждане на събития, заради монтирания екран и амфитеатрално разположение на местата за сядане.\n\nТекст и снимки: podlezno	t	0	42.69030354546937, 23.33134040164101	4	1	3	2022-01-29 20:56:17.083+00	София	1	48	2
150	Фар-скулптура в Царево	Фарът-скулптура в град Царево е първия по рода си в целия свят. Открит през 2014, той е изграден във формата на тракийска богиня. Фигурата на жената е внушителна, с вдигнати ръце, които държат обект, приличащ на корона или царски венец, но който всъщност служи да символизира, че богинята е „носителка на светлината“. Статуята е направена от бронз, тежи 3 тона и е висока 5,5 метра. Монтирана е върху бетонен пиедестал и се намира на вълноломната стена на курорта, на 16 метра над морското равнище.\r\n\r\nСкулптурата на тракийката символизира гостоприемството на Царево, както и на сигурността и безопасността на идващите от морето. Твърди се, че фарът е адаптация на статуя от гробницата в село Свещари. Изработена е от българския скулптор и художник Павел Койчев, който също е автор на „Градежът“ – еко-къща край автомагистрала Хемус, която Койчев описва като „скулптура, която може да се обитава“.\r\n\r\nАко решите да отидете до вълнолома на курорта да посетите забележителността, можете да го комбинирате с разходка из морската градина на Царево, в която също има кафенета, мини-голф и площадки за деца. Можете и да разгледате пристанището или пък да посетите панорамната тераса на нос Лимнос – най-издадената точка на град Царево.\r\n\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/far-skulptura-tsarevo/	t	0	42.169725,27.859487	4	1	2	2022-04-12 07:52:31.98+00	Царево	1	48	1
145	Стобски пирамиди	В подножието на западната част на Рила планина, над село Стоб, се намира едно изумително скално формирование. Това са така наречените Стобски пирамиди – скални пирамиди, формирани вследствие на ерозионната дейност на водите в района. Скалният характер и типът почва в тази местност предпоставят лесното отмиване на горните им слоеве. Така течащите води оформят ерозионни бразди, които с времето стават все по-големи и по-дълбоки. А всъщност незасегнатите от водите части остават да стърчат по-високо, образувайки причудливи форми, подобни на пирамиди и конуси. Цветът на Стобските пирамиди е оранжево-кафеникав, което ги откроява изключително много от гористия фон наоколо. Особено красива е картинката в късния следобед или по залез слънце, когато слънчевите лъчи огряват директно пирамидите, правейки гледката неописуемо красива. Стобските пирамиди наподобяват доста Мелнишките, но се различават по цвета и гъстотата. Стобските пирамиди са по-малки като размери (7-12 метра височина), но са концентрирани на доста по-малка площ.\r\n\r\nПътеката, водеща към пирамидите, започва от края на село Стоб. Там се стига до паркинг, а встрани ще видите билетната каса и началото на пътеката. Цените на билетите са символични. Началото на пътеката е приятно – пътят е широк, без особен наклон, а и има дървета, хвърлящи сянка. Не се подлъгвайте обаче – нагоре терена става все по-открит и стръмен, а слънцето пече жарко дори и през студените месеци. Носенето на шапка и вода са задължителни, особено в топлата част от годината. Пътят криволичи и след няколко по-големи завоя се превръща в по-тясна пътека, а постепенно и наклонът се увеличава. На около 25-тата минута се достига първата група скални пирамиди, които могат да се видят от една естествено оформена тераса, обезопасена с парапет. Формите, цветът и разположението на пирамидалните образувания са възхитителни. Продължаваме нагоре, където има още 2-3 такива тераси. Преди последната има доста стеснен и стръмен участък от пътеката (няколко метра), който трябва да изминете на четири крака, но не е опасно. От най-горната тераса гледката е вълшебна – морето от оранжеви скални пирамиди ви обгръща и от двете страни. Пред тях се простира равнината, а още по-вдясно се вижда високото било на Рила с върховете Малък и Голям Полич. Гледката и емоцията определено си заслужават. Цялата пътека се изминава за 30-35 минутки в посока. Има обособени места за отдих и спиране.\r\n\r\nЕдна изключително любопитна местна легенда разказва за начина на образуване на пирамидите край село Стоб. На мястото на пирамидите някога имало равнина с мегдан, където се правели всички местни сватби. Залюбили се една девойка и един момък. Всичко било прекрасно, но майката на девойката не харесвала младоженеца и разубеждавала дъщеря си от решението ѝ. Ала младите били готови на всичко за любовта си. Тогава майката отишла насред равнината, забила един кръст дълбоко в земята и проклела сватбата: когато младоженецът целуне булката, всички гости да се превърнат в скали. Дошъл денят на сватбата и само майката не отишла. Цялото село било щастливо, но когато момъкът целунал булката, всички сватбари се превърнали в скали. Оттогава край село Стоб се издигат причудливите скални пирамиди.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/stobski-piramidi/	t	0	42.096462,23.113069	3	1	3	2022-04-12 07:40:57.202+00	Благоевград	2	48	1
69	Научен Подлез	14 6 6 3 1 7 14 15 5 1 8 14 1 6 25 3 18 9 24 11 15 3 1 7 14 15 19 15 6 5 1 8 15 1 6 25 11 27 5 6 5 1 4 15 14 1 13 6 17 9 25\nТова е изписано по рампата на подлеза под бул. България, при техникума по текстил и моден дизайн. Можете ли да се досетите какво пише?\n\nНе, в Научния подлез няма да разберете какво е закодираното послание, но ще откриете още интригуващи загадки. Ще се разходите из един своеобразен музей за деца и възрастни, в който различни науки са представени по интересен визуален и креативен начин чрез рисунки и интерактивни инсталации.\n\nВ тази необичайна галерия ще разберете повече за звездите, за изкуствения интелект, за химичния състав на Земята, за микроорганизмите, за нашето ДНК, за “еволюцията” на компютрите и още много. Монтирахме специално (истински) соларни панели, които да захранват светещите ни инсталации – вятърна турбина и соларен панел (нарисувани), които “захранват” инсталацията на град с електричество; човек, който “оживява”, когато сърцето му “затупти”; и главната атракция – контролен пункт, който пренася минувачите в едно паралелно измерение…\nТекст и снимки от: https://podlezno.org/nauchen-podlez/	t	0	42.68081791972769, 23.30711580741286	4	1	3	2022-01-29 20:49:11.63+00	София	1	48	35
146	Водопад Рилска Скакавица	Водопадът Скакавица в Рила планина е една красива и зареждаща дестинация, която може да бъде посетена в рамките на един ден. Скакавишкият водопад се намира по поречието на едноименната река, извираща от района на Седемте рилски езера. Спускайки се към Скакавишката долина, планината тук е образувала почти отвесна скална стена, по която водата се спуска стремглаво надолу, образувайки прекрасния водопад. По официални данни водите му се спускат от височина около 70 метра.\r\n\r\nТова е и един от най-високо разположените големи водопади на територията на страната ни – намира се на близо 2000 метра над морското равнище. Водите му са най-пълноводни през късната пролет, а през зимния сезон водопадът замръзва и предлага възможността за ледено катерене.\r\n\r\nВсъщност гореописаният водопад, или още Големия Скакавишки водопад, не е единственият в района. Пътеката към големия водопад минава покрай няколко по-малки водопади, които са не по-малко впечатляващи. Класическият маршрут към водопад Голяма Скакавица стартира от местността Зелени преслап. Оттам се тръгва по черен коларски път и след 20-25 минути се отклонява вдясно по пътеката към хижа Скакавица (има табели). Ако не искате да изпуснете по-малките водопади, се ослушвайте за шумолене на вода, докато вървите нагоре. Точно преди да започне един по-стръмен участък от пътеката ясно ще можете да чуете звука от водопадите вляво от вас. Стигнете ли водопада, може да направите и кратка почивка там, защото мястото е великолепно. За по-мотивираните – водопадът пред вас не е единствен – над него има още няколко, до които може човек да се изкатери. Така се образува каскада от няколко малки водопада, които огласят гористата околност със своята песен.\r\n\r\nПътеката продължава със споменатия наклон, който малко ще ви поумори. На места е обезопасен с дървени парапети. След тази част пътеката отново става почти равна и след още малко ходене ще се озовете на хижа Скакавица. Това е най-старата високопланинска хижа в България, построена през 1922 година. Предлагат се топли ястия и стаи за нощуване. Хижата е и част от „100-те национални туристически обекта“(за любителите, събиращи печатите, в самата хижа са). Въпреки това, хижа Скакавица и водопадът Рилска Скакавица остават леко в сянката на близката масово посещавана забележителност Седемте рилски езера. Това пък прави маршрута една идея по-спокоен.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/rilska-skakavitsa/	t	0	42.317212,22.99529,10z	3	1	3	2022-04-12 07:43:29.132+00	Сапарева баня	2	48	0
77	Сградата с децата	Двете най-интересни неща у това здание са детските фигури в горната й част и интересните заоблени балкони, изстърчащи от нея.	t	0	42.69886876984724, 23.324545387736418	1	1	2	2022-01-30 13:26:50.024+00	София	1	48	3
153	Екопътека „Червен камък“	Гледайки в източна посока от град Девин, човек няма как да не забележи голямата изразителна скала на върха на близкия хълм, заедно с дървената постройка върху нея. Тази скала е така наречената местност „Червен камък“, а постройката отгоре ѝ представлява новосъградена наблюдателна кула. Местна легенда разказва, че когато османците превзели този край, част от жителите на региона били посечени на скалата и хвърлени от нея. Кръвта им обагрила в червен цвят скалата и затова местността била наречена „Червен камък“.\r\n\r\nМестността „Червен камък“ е всъщност най-високата част от екопътеката, наречена „Храстево“. Районът тук е защитена територия, целяща да съхрани вековната гора от черен бор. Някои дървета са на възраст над 300 години. Счита се, че „Храстево“ е сред най-старо основаните защитени територии в страната ни, а нейният статут като такава е официално възвърнат през 2012 година.\r\nМакар и формално приетото име на екопътеката да е „Храстево“, местните обичат да използват и названието „Червен камък“. На нас също ни хареса това наименование, а гледката от наблюдателната кула на „Червен камък“ беше най-приятната част от цялата разходка.\r\nПътеката започва от източния край на град Девин, така наречената местност „Трабешково“. Скоро се появяват добре оформени в земята стъпала. Стълбите са доста, но пък за кратко време преодоляват немалка денивелация. След изкачване по тях за поне 15-20 минути, накрая се стига до заравнено пространство, където ще видите дървената кула и оградата около нея. Кулата е висока над 5 метра, а наблюдателната площадка – около 2,5 метра. Гледката от тази площадка обаче е ослепителна. Целият град Девин се открива пред вас, ограден отвсякъде от хълмовете на Родопите. Истинска наслада за очите. На наблюдателната площадка може да отпочинете, а дори и да хапнете (ако си носите храна), любувайки се на пейзажа.\r\n\r\nОттам пътеката продължава, като минава през няколко обозначени участъка на вековна гора. Краят на пътеката излиза на главния път Девин – Лесичево. Общата ѝ дължина е около 2,5 километра и се минава за час с почивки и добро темпо. Ние имахме сили и да се върнем обратно по същия път до града. Разбира се, посоката на пътеката може да бъде наобратно – тръгване от отбивката от пътя Девин – Лесичево и завършек при местността „Трабешково“. Този вариант определено е подходящ за хора, които не обичат да се изкачват по стълби. Като цяло, екопътеката „Червен камък“ е идеален вариант за лека дневна разходка сред природата край град Девин.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/cherven-kamuk/	t	0	41.746454,24.409347	3	1	3	2022-04-12 08:03:11.065+00	Девин	2	48	0
74	Небостъргачът	Ако има сграда, която наистина прилича на прототип на съвременните небостъргачи, това е тази сграда. Стандартна по височина в по-голямата си част, в ъгъла между двете пресечки, между които се простира, изневиделица изниква висока кула, увенчана на върха с монолитни човешки статуи. За щастие в момента тези статуи, които на снимките се рушат, са възстановени и са в сравнително приличен вид.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/56\n	t	0	42.69867984177637, 23.32482877824792	1	1	2	2022-01-30 13:13:25.195+00	София	1	48	3
79	Красивият ъглов еркер	Разчупената фасада на този дом впечатлява и с богатата си декорация на основата си. Флоралните пластични елементи в стил сецесион са изключително красиви.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/375	t	0	42.69203954317212, 23.321019752158076	1	1	2	2022-01-30 13:35:31.724+00	София	1	48	12
75	Безжизнен дом	Тази къща в стара София излъчва достолепие и сигурност, но вестниците по прозорците, откъртените от пантите врати и рушаща се фасада създават усещането, че в нея отдавна няма живот, а здравецът на балкона е последният й обитател.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/66	t	0	42.70117626001331, 23.324175574092973	1	1	2	2022-01-30 13:19:21.393+00	София	1	48	4
64	Къщата охлюв	Къщата охлюв е уникална сграда в квартал Симеоново, София. Разположена е на бул. „Симеоновско шосе“.\n\nДело е на инж. Симеон Симеонов. Построена е през 2008 г.\n\nПредставлява цветен охлюв, а облите ѝ форми са изваяни от полимербетон. Нейната енергийна ефективност е 8 пъти по-висока от тази на санирана сграда. Разперилата криле калинка на покрива, служи за похлупак на комина. Антенките ѝ служат не само за гръмоотводи, но и за лампи през нощта.\n\nОглавява класация за най-странната сграда в света.\n\nИзточник: https://bg.wikipedia.org/wiki/Къщата_охлюв	t	0	42.61742246209158, 23.336959711553543	1	1	2	2022-01-29 17:04:25.901+00	София	1	48	131
168	Меджиди табия	Турският форт „Абдул Меджиди”, или така наречената крепост Меджиди табия, се намира южно от Силистра и е най- запазеният от шестте укрепителни пункта на фортификационната турска система, изиграла важна роля в Кримската (1853-1856 г.) и Руско-турските войни (1853-1856 г. и 1877-1878 г.). Построена е заради необходимостта от допълнително укрепване на крайдунавските градове, когато реката се утвърждава като естествена граница на Османската империя. Идеята за построяването на тази система от военни укрепления е дело на немския военен инженер Хелмут фон Молтке (1800 г. -1891 г.) , посетил града през 1837 г.\r\n\r\nКрепостта е строена през периода 1841-1853 г. с безплатния труд на 300 принудително събрани българи. Главните майстори са от Дряново, а каменоделците са от региона на град Силистра. По време на строителството на крепостта те строят и първите монолитни възрожденски храмове в Силистренско – в Алфатар (1846 г.) и Калипетрово (1847 г.) Строежът на крепостта е привлякъл вниманието на султан Абдул Меджид, който през 1847 г. пристига, за да огледа строителните работи. Оттам идва и името на крепостта – Меджиди.\r\n\r\nКрепостта е била завършена по времето на областния управител Саид паша в навечерието на Кримската война. Крепостта играе важна роля по време на Кримската война, която започва през 1853 г. с битката за Силистра. В сраженията около крепостта участва гениалният руски писател Лев Николаевич Толстой (1828 г. – 1910 г.).\r\n\r\nСъоръжението е активно използвано и в Освободителната за българите Руско-турска война от 1877-1878 г.  Крепостната стена има формата на шестоъгълник и достига на височина до 8 м. Непосредствено до нея има ров, служил едновременно за препятствие и маскировка.\r\n\r\nМеджиди табия е единствената напълно съхранена в интериор и екстериор крепост от османската епоха в България.\r\n\r\nВ крепостта може да се види временната експозиция „Съдбините на Силистра през XV-XIX в.“.\r\nСнимки и текст: https://bulgariatravel.org/bg/крепост-меджиди-табия-град-силистра/	t	0	44.10278753833373, 27.257034480136557	6	1	3	2022-04-12 16:19:21.488+00	Силистра	1	48	1
76	Синята перла	Масивни коринтски колони, огромни зсводени прозорци, декоративни елементи по фасадата, отново декорация във формата на колони, масивен фриз...трудно е да се изброят многото изящни елементи на това софийско здание от 1923 г. Прекрасна е и внушителната метална порта на входа на сградата, а рамката й е украсена с изящен фриз с флорални елементи.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/357	t	0	42.69599199999572, 23.323875883432038	1	1	2	2022-01-30 13:22:42.819+00	София	1	48	2
147	Манастир „Св. Богородица Спилеотиса“	Ако пътят ви минава близо до град Мелник и търсите спокойно, уединено и красиво място, то манастирът „Св. Богородица Спилеотиса“ е прекрасен вариант. Той се намира на върха на хълма Св. Никола, южно от града. Първоначално манастирът е построен през 13-ти век от деспот Алексий Слав, а по-късно става метох на Ватопедския манастир в Атон. Цялата местност около манастира се знае под името „Света Зона“. На няколко пъти през вековете манастирът бива разрушаван. През 1795 година на мястото на развалините на манастира е построена малката църква „Св. Богородица на Светия пояс“. Сред местните хора локацията е на особена почит. Твърди се, че през Средновековието в манастира се е съхранявала и част от действителния свети пояс на Божията майка.\r\n\r\nДо върха на хълма, където се намира храмът, се стига по кратка екопътека през широколистна гора. Има обособени стълбички от дъски и камъни, които улесняват изкачването. Цялата пътечка се изминава за 20-25 минути, след което теренът вляво се открива и ще можете да видите бялата църква насреща. Освен това личат и останките от крепостни стени и ровове, защото през Средновековието около манастира е била разположена и отбранителна крепостна кула.\r\n\r\nА гледката от върха на хълма е неописуема. Около теб се шири едно море от пясъчни пирамиди, което изглежда, че няма край. Това е мястото, от където човек може да види истински красотата на чудните Мелнишки пирамиди. Но кръгозорът не свършва само с тях. Зад самите пирамиди величествено се издига снагата на Пирин планина. Далеч надясно пък стърчат върховете на Славянка, а противоположно на Пирин гордо стои Беласица. Под нея Санданско-Петричкото поле кротко наблюдава заобикалящите го гиганти. Не е учудващото, че мястото е считано за свято. Иначе на върха на хълма има достатъчно места човек да поседне, да погледа и да хапне нещо. Който желае може да влезе в храма да се помоли.\r\n\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/manastir-spileotisa/	t	0	41.478638,23.477569	3	1	4	2022-04-12 07:46:02.177+00	Сандански	2	48	0
83	Сградата с българката	Величествената ъглова сграда е постоена през далечната 1926 г. Там тогава се е намирало Чиновническото осигурително дружество. Високата постройка завършва с осемстенен купол. С уникалната си скулптурна композиция от три фигури, несъмнено той е най-ценният елемент в тази сграда. Видният скулптор Иван Лазаров дава изпълнението на творбата на Тодор Делирадев. Скулптурата е направена от бял врачански мрамор. Фасадата и цялостният облик на зданието са решени в стил късен сецесион повилян от съвременната класика. Автори на тази масивна монументална постройка са Георги Фингов, Никола Юруков и Димо Ничев. Дело на същото проектантско трио са и бившата Софийска банка – днес централа на ДСК на ул. „Московска”, както и Българската търговска банка – сега Корпоративна търговска банка.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/428	t	0	42.695440426729206, 23.32844481606563	1	1	2	2022-01-30 14:04:31.208+00	София	1	48	16
151	Разбоишки манастир „Въведение Богородично“	Далеч на запад, едва на 4 километра от границата ни със Сърбия, се намира китният Разбоишки манастир. Разположен е сред каньона на река Нишава, в близост до село Разбоище и е част от Софийската епархия на Българската православна църква. Това е единственият манастир в България, чиято църква е извън манастирския двор. Храмов празник е 21 ноември.\r\n\r\nРека Нишава, събираща своите притоци от подножието на връх Ком, създава дълбок и красив пролом в района между село Разбоище и село Калотина. Стръмните и недостъпни скали, както и малките пещери над реката, още от времето на Първата българска държава приютяват монаси-отшелници. Техният брой постепенно нараства и скоро монасите се организират в монашеско общежитие. Има известни сведения, че през 1232 година, сръбският светец Свети Сава посещава пещерите на път за Йерусалим. На връщане от Йерусалим, през 1236 година той приема поканата на българския цар Иван Асен II и отсяда в Търново, където обаче се разболява и умира. По време на турското робство манастирът е бил опожаряван три пъти. През 1861 г. жилищните и стопански постройки били построени отново, но от другата страна на реката. По този начин главната църква, изградена високо в скалите, остава извън самия манастирски комплекс. По време на национално-освободителните борби манастирът приютява дори Васил Левски и неговия спътник Матей Преображенски. Църквата е обновена през 1841 г., и така стенописите и от 15-16 в. били покрити с вар. Единствено на западната фасада са запазени части от „Страшния съд“.\r\n\r\nМанастирът е сравнително достъпен и пътят ви от началото на пътеката ще е не повече от 30-35 минути в посока. Пътеката започва в края на село Разбоище, където приключва асфалтът, а по-високите коли могат да продължат по черният път още поне 400-500 метра. Следва стръмно спускане към долината на реката, като още в началото му се открояват страхотни гледки на север към възвишенията на планините Вучибаба и Видлич. В посока северозапад се вижда и част от голямата мина за добив на лигнитни въглища-Станянци. Вече в близост до реката, в ляво от вас ще се отвори и широка гледка към манастира, църквата и пролома на Нишава. Пътеката се качва на железопътната линия „Калотина-Станянци“, изградена заради мината. Единственият начин да преминете от другата страна на реката, където е и манастирът, е да минете по моста на жп-линията. Линията все още се използва за товарни дейности и там преминават влакове, затова внимавайте и бъдете нащрек!\r\n\r\nКогато наближите постройките на манастира, слезте от линията и се насочете към тях. След преминаването през двора на манастира, пак се пресича виещата се река, чрез малко дървено мостче. Следа изкачването на каменни стъпала, които отвеждат до входа на църквата в скалната ниша.\r\nВ района можете да видите Чепърлинския и Букоровския манастир, както и каскадата от водопади „Котлите“.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/vsichki/	t	0	42.985398,22.981968	3	1	4	2022-04-12 07:55:02.621+00	Разбоище	3	48	1
149	Приморско променада	Всеки, който познава града Приморско, знае, че крайбрежната му ивица е разделена на два плажа – Северен и Южен. Но през последното си посещение на черноморския курортен град открихме променадата на Приморско – чаровна крайбрежна алея, която върви по носа на брега, разкривайки уникална гледка към морето и предоставяйки прекрасна възможност за разходка.\r\nПрез ден, който беше твърде ветровито за плаж, ние решихме да се разходим из града, тъй като имаше части, които още не бяхме посещавали. Стигайки до южния край на Северния плаж, ние открихме тази алея, по която поехме. Мислехме, че тя ще бъде кратка, но се оказа, че върви покрай целия нос на града и свършва при пристанището на Приморско в северната част на Южния плаж.\r\nРазходката е изключително приятна. Намирате се на по-малко от метри от водата, която величествено се разбива в камъните, които са поставени между морето и алеята. От време на време ще усетите фините пръски на черноморската вода, която вятъра донася към алеята. Мястото е перфектно за отдих и за наслаждаване на гледката. Да извървите цялата алея отнема не повече от час, а изживяването със сигурност си заслужава. Вървейки и слушайки вълните на морето и песента на вятъра, ви обзема чувство на откъснатост от останалата част на света. Иначе оживеният курортен град се изплъзва от вас.\r\nПо цялата алея са поставени пейки, на които човек да поседне. Оборудвана е и с лампи, както и кошчета за боклук. Освен това из камъните има обрисувани най-различни известни личности от българската и от световната история. Така променадата се превръща в една импровизирана алея на славата, където човек си припомня за най-различни легендарни персонажи, събрани в един общ пантеон на това чудесно място. От време на време има и статуи или паметници. Един от тях е кръст в памет на удавилите се през 1951 г. на далян Кондрус. Сигурна съм, че и много от другите паметници крият късче история у тях.\r\nНо алеята е перфектна и за тези, които не търсят нищо повече от една спокойна разходка по българското черноморие.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/promenada-primorsko/	t	0	42.265943,27.766757,13z	6	1	2	2022-04-12 07:50:48.936+00	Приморско	1	48	2
148	Беглик таш	Намиращо се на 5 км северно от черноморския град Приморско, Беглик таш е старинно тракийско светилище, с артефакти датирани още от VII – V век пр. Хр. (късната Бронзова ера). По-късните находища датират IV век сл. Хр. Предполага се, че светилището е функционирало близо 2000 години. Най-вероятно е било прекъснато през IV век от настъпващото християнство. Целият комплекс покрива приблизително 12 декара, като централната част на светилището е разположена на 8 декара.\r\n\r\nИмето „Беглик таш“ идва от турски език: „беглик“ значи данък, а „таш“ – камък. Името най-вероятно крие корените си в периода на Османското робство, когато данъците, (във вид на добитък) плащани от български пастири са били събирани при камъните в местността.\r\n\r\nАрхеологически проучвания през периода 2002 – 2005 г. откриват множество артефакти и остатъци от съоръжения, скални изсичания и други. Разчистват и западния вход на светилището, за да го направят по-достъпен. Въпреки многото усилия, голяма част от светилището остава непроучено заради липса на средства.\r\nОбектът отваря врати за туристи едва през 2003 година. Изработен е общ план – карта, която получавате на място. Тя ви насочва и съдържа информация за различните артефакти. Археолози са ги изучавали, датирали и предполагали тяхното предназначение. Например, обект номер 12 се смята да е служел за слънчев часовник: състоял се от 6 големи камъка и в зависимост от това върху кой камък е падала сянката на слънцето, траките разбирали коя част на деня е. С времето обаче е бил съборен и сега наподобява паднали домино блокчета. Артефактите на картата са общо 14 и всеки от тях крие подобна интересна предистория.\r\nСветилището е прекрасна идея за еднодневна разходка и представлява възможност човек да се потопи в праисторията на българските земи.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/beglik-tash/	t	0	42.32932193234451, 27.763019960076743	3	1	3	2022-04-12 07:48:48.573+00	Приморско	2	48	1
152	Манастир „Света Анастасия Фармаколитрия"	Малко хора знаят, че на територията на българското Черно море има няколко острова. Още по-неизвестен факт е, че един от тях е дори обитаем. В тези две кратки статии ще ви разкажем за основните забележителности, които можете да разгледате на перлата на българското черноморие известна като остров Света Анастасия.\r\nОстровът се намира в Бургаския залив, разположен на 6,5 километра югоизточно от град Бургас и се е появил след изригването на вулкан. Площта му е приблизително 9 декара. Първите свидетелства за човешко присъствие датират още от времето на късната античност.\r\n\r\nНа Света Анастасия се намира и единствената манастирска островна обител, която е запазена до наши дни – манастира „Света Анастасия Фармаколитрия (Лечителка)“. През своята дълга история той е ставал неколкократно жертва на пиратски набези и опожарявания. Легенда твърди, че в миналото манастирът бил нападнат от морски разбойници, търсещи съкровище заровено на острова от стар пират. Монасите се заключили и започнали да се молят на Света Анастасия да ги спаси. Светицата чула молитвите им изпратила страшна буря, която потопила пиратския кораб. Неговите останки се вкаменили и така се появило скалното образувание Вкамененият пиратски кораб. Що се отнася до златното съкровище, смята се, че то още лежи скрито в подземията на острова. Други интересни скални феномени изваяни от морските вълни са Дракона, Портата на слънцето и Гъбата, където се твърди, че е погребан монах.\r\n\r\nПокровителката на острова Света Анастасия била наричана Фармаколитрия, което на гръцки ще рече „избавителка от страдания“, или по-просто лечителка. Точно заради това на острова можете да откриете автентична лекарница, предлагаща разнообразни билкови напитки и продукти.\r\nОсвен манастира, на острова има музей и ресторант с черноморска кухня, за които можете да прочетете в другата статия на локацията о. Св. Анастасия.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/manastir-svanastasiya/	t	0	42.467963,27.553212	6	1	4	2022-04-12 07:57:36.176+00	Бургас	2	48	2
44	Филмов подлез	Ако се опитате да пресечете “Цариградско шосе” при ул. “Светослав Тертер”, едва ли ще очаквате подлезът да ви посрещне с червен килим. Но ако продължите надолу по стъпалата, ще се потопите в света на киното. Ще ви посрещнат актьори от зората на филмовата индустрия и ще ви очароват сменящи се образи от любими български, американски, световни филми, анимации и аниме. За по-сантименталните сме вплели във “филмовата лента” и цитати от любими герои.\n\nАкцент в композицията е “стената на славата”, където млади български актьори сложиха гипсови отливки на ръцете си, за да направят моста между неостаряващото минало и новите хоризонти в киното. Запознахме се с Калин Врачански, Теодора Духовникова и още 7 млади таланти. Тодор Колев също се усмихва с цигулката си в един от кадрите на филмовата лента.\n\nТрицератопсът от Джурасик парк “оживя” в огромен 3D пъзел, който подарихме на децата от съседната детска градина, а за по-възрастните предвидихме зелена градинка за отдих.\n\nТекст от: https://podlezno.org/filmov-podlez/	t	0	42.687511137933924, 23.342252240395606	4	1	3	2022-01-17 18:35:46.727+00	София	1	48	4
68	Графити подлез	Графити подлезът носи името “Пътуване във времето” – от една страна, защото е близо до жп гара “Подуяне”, а от друга – защото бързината с която го направихме се доближава до скоростта на светлината. 😀 Мнозина го смятаха за “невъзможния проект”, но ние успяхме да направим концепция, конкурс за графити артисти, да съберем рисунки, да вземем разрешително от Общината… и да го осъществим само за девет дни!\nДвадесет и един невероятно талантливи графитисти рисуваха своите интерпретации за миналото, настоящето и бъдещето и превърнаха мрачното пространство в любопитна творба на изкуството. Ако минете оттам, ще ви приветстват птерозаври, ще видите срещата между робот и неандерталец, можете да се поразходите в стара София, да се снимате с красива българка в носия, а ако се сприятелите с бързия охлюв, можете дори да излетите в космоса. \n\nАкцент обаче са два “светещи графита”, които фосфоресцират с помощта на UV лампи и впечатляват нощните минувачи.\n\nАко сте любители на графитите или пък скептици, които смятат, че това е вандализъм – посетете подлеза под бул. “Ботевградско шосе” при пл. “Пирдоп” и оставете изкуството да говори само.\n\nТекст и снимки: https://podlezno.org/graffiti-podlez/	t	0	42.699389676239, 23.359581560343294	4	1	3	2022-01-29 20:45:20.766+00	София	1	48	5
154	Манастир Палигоден край Банско	Манастирът „Рождество пресв. Богородица – Палигоден“ се намира в ниската част на северните склонове на Пирин, само на няколко километра западно от град Банско. В близост до него се намират язовир Белизмата и плочата „Момин гроб“.\r\nМанастирът е бил построен по времето на Второто българско царство, но османците са го разрушили до основи по време на робството. Поетапно възстановяване е започнато през 1936 г. Реставрацията е завършена през 1964 г. и манастирът е бил осветен от митрополит Пимен.\r\nМоже да се влезе в манастирския комплекс, но самата църква невинаги е отключен. Дворът е приятен и усамотен, заобиколен от каменна ограда, има маси, пейки и дървета за сянка. Външността на манастира е старинна, изградена от камък, с голяма заоблена входна врата и малки прозорци.\r\n\r\nНамиращият се в близост язовир Белизмата предлага перфектно място за риболов, пикник, разходка или просто ден, прекаран на чист въздух. Има и работещо заведение „Рибарска среща“, което предлага разновидност от опции за хапване. А ако решите да се разходите до хълма над язовира, там ще откриете плочата „Момин гроб“.\r\n\r\nОсвен възможностите за пешеходна разходка, около манастира започват и прекрасни пътеки за планински колела, които са често посещавани от ентусиасти. Независимо дали пеша или с колело, пътеките са изключително приятни и си имат маркировка, която да се следва.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/paligoden-bansko/	t	0	41.833213,23.454221,10z	3	1	3	2022-04-12 08:08:07.533+00	Баня	1	48	0
161	Окото на с. Омар	Скален феномен „Окото” се извисява над с.Осмар, общ. В. Преслав. Селото отстои на 12 км от Втората българска столица Велики Преслав и на 10 км от град Шумен. Скалните образувания от Осмарската долина са част от Шуменското плато, заемащо територия около 40 кв. км между Предбалкана и Лудогорието, в южната част на Източната Дунавска равнина. „Окото” е спираща дъха канара с елипсовиден отвор в средата, наподобяващ очертанията на око. Известна е още под името „Халката”. В изкуствено разширена пещера, във вътрешността й, се намира Костадиновия манастир. Неслучайно Осмарският боаз се нарича Манастирската долина. Неговите скали са подслонили множество килии, църкви и гробници, образуващи интересен манастирски комплекс от времето на Второто българско царство.\r\n\r\nДо с. Осмар може да се стигне и с автобус по линията Шумен – Велики Преслав, а ценителите на природните красоти могат да отседнат в красивите къщи за гости.      \r\n\r\nТуристическият маршрут за преминаване през Осмарските скали и манастири е с начална точка с. Осмар. Тръгва се в северна посока по път, който следва Осмарската река. Навлиза се в Осмарския боаз, преминава се през Манастирската долина. След около 2 км пътят постепенно завива на дясно и навлиза в гориста местност. От тук, на около 500 м напред пред погледа се разкриват трите основни масива, където са разположени скалните църкви. Пътят отвежда до малка поляна, където има каптаж и чешма, а над тях смесена широколистна и иглолистна гора. Поема се по тясна лъкатушеща пътека и след сравнително стръмно изкачване се стига до Костадинов манастир. Най-силно впечатление прави именно необикновената канара с елипсовиден отвор, който като „Око” разкрива красотите на Преславския край чак до очертанията на Стара планина. Продължава се по пътеката нагоре. Достига се до добре очертан горски, по който се върви около 30-40 мин. Следва спускане и след 10 мин. пътеката минава покрай основите на разрушени бунгала и се стига до хижа “Букаците” в м. Осмарските колонии. Може да се посети скалната обител Манастира, който се вижда от хижата. Преминава се Троишката рекичка и след екстремно изкачване по нейския стръмен ляв бряг се стига до крайната цел. При наличие на повече свободно време може да се нощува на хижа “Букаците”. Следва предвижване до село Троица, като се върви по каменист път, който се спуска надолу, като следва река Троишка. Трябва да се внимава за отклонение в ляво, което отвежда в подножието на скален феномен Момата- Момина скала. Легендата разказва за хубавата Параскева, дъщеря на местен феодал, която се хвърлила, за да се спаси от османлиите.След това се преминава край помпена станция и покрай фабрика за вародобив. Пътят отвежда за село Троица.             \r\n\r\nДруг вариант за достигане на скалния феномен Окото е да се тръгне от село Троица, да се премине през Троишкия боаз, хижа “Букаците” и да се слезе до Костадинов манастир, Диреклията и Подковата и след едночасово слизане да се стигне до село Осмар.\r\n\r\nЗа любителите на преходите вариант е и маршрута от Окото към най-високата точка на Шуменското плато Търнов табия (502 м).\r\n\r\n\r\nСнимки и текст:\r\n https://otbivki.com/%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D1%82%D0%B5-%D0%BC%D0%B5%D1%81%D1%82%D0%B0-%D0%B2-%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/\r\nи \r\nhttps://preslav.dartek.bg/bg/the-eye-rock-formation	t	0	43.218248713028736, 26.851696462939916	3	1	3	2022-04-12 10:12:15.709+00	Осмар	2	48	0
73	Морски подлез	Близо до необятното море студенти, бургазлии и туристи вече могат да се “гмурнат” в малък океан от изкуство.\n\nНовият Морски подлез беше определен като “перлата на Бургас” от местни хора, които с интерес разглеждаха новите “подводни обитатели” на подлеза при университет “Проф. д-р Асен Златаров”.\n\nПреди да слезете по стълбите на подлеза, сложете си шнорхел или си поемете дълбоко въздух, и непременно се пригответе за снимки, защото в подземната галерия ще ви посрещнат огромен кит, усмихнати делфини, прелестни медузи, нагиздено морско конче, величествен октопод, зеленокоса русалка и още много малки и големи стенописи. А по-наблюдателните от вас ще забележат, че този подлез е “прозорец” към два различни свята – морският и океанският.\n\nАвтори са изключително талантливите дебютанти от 51 СУ “Елисавета Багряна”, гр. София, напътствани и подпомагани от отдадения художник и учител по изобразително изкуство Иван Матеев и менторите от ПОдЛЕЗНО – Юлия Иванова и Димитър Стафидов.\n\nТекст и снимки: https://podlezno.org/morski-podlez/	t	0	42.52656381599395, 27.450485778514853	4	1	3	2022-01-29 21:06:10.334+00	Бургас	1	48	5
155	Кукленски манастир „Св. Св. Козма и Дамян“	Разположен по склоновете на дела Чернатица в Западните Родопи, Кукленският манастир „Св. Св. Козма и Дамян“ е една перфектна възможност за еднодневна разходка на чист въздух. Разположен южно от град Пловдив, манастирът е кръстен на светите братя Св. Св. Козма и Дамян, твърди се, заради техните лечебни умения. Наречен е и „кукленски“ заради близкото село Куклен. До манастира може да се стигне с кола или пеша по множество различни пътеки. Ние тръгнахме пеша от село Брестник и похода до манастира беше около 2 часа.\r\n\r\nВярва се, че манастирът е бил построен по време на Второто българско царство, но има данни за него в стари писания още от 11-ти век. Първоначално кръстен „Св. Безсребърници“, името му по-късно е сменено в чест на избраните патрони Св. Св. Козма и Дамян, заради техните лечителски способности. Впечатляващото за манастира е, че е останал непокътнат из вековете, дори по време на помохамеданчването на родопските българи, когато над 30 манастира и 200 църкви в района са били подпалени и разрушени. Според поверието манастирът е останал незасегнат, защото османците са го ползвали за убежище, в което да се лекуват. Много интересно поверие е свързано с целебния извор, който се смята, че може да излекува всички нечистоти и болести.\r\n\r\nМанастирът е направен на три нива, като се състои от жилищни/стопански сгради, както и две църкви – едната от която е нова, построена през 50-те години на миналия век. Още преди да влезете ще видите стенопис и красиви червени цветя при входа. Вътре се разкрива изключително красивия и много добре поддържания комплекс. Има стенописи, цветя и дръвчета навсякъде, бялата боя изглежда току що нанесена, а каменната облицовка допринася за цялостния очарователен вид на манастира. Ние бяхме много впечатлени от красотата и даже коментирахме, че това е сред най-хубавите манастири, в които сме били.\r\n\r\nАко слезете надолу по централните стълби от ваше ляво ще видите Старата църква, в която можете да влезете, да закупите и да запалите свещичка. Има вътрешна зала, в която се извършват церемонии. Навсякъде из църквата има икони, а стените са обрисуванив стенописи. Пред Старата църква има малка поляна с пейки, на които можете да поседнете за почивка. Разходката до манастира беше приятна, а самият манастир надскочи очакванията ни във всички аспекти.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/kuklenski-manastir/	t	0	42.034219241885076, 24.75560903993239	1	1	3	2022-04-12 09:54:27.948+00	Пловдив	1	48	0
159	Рудник „Цар Асен“	В района на Панагюрище има много изоставени кариери, в които по времето на социализма са били добивани цветни метали…От някогашния рудодобив са останали само огромни кратери, които днес са запълнени със застояла вода. В отровните окиси на дъното може да бъде открита цялата Менделеева таблица. Снимката, която вуждате, е направена в околностите на с.Цар Асен (област Пазарджик).Там се намира голяма кариера за добив на мед и други окисни руди. В района на Панагюрище има много изоставени рудници. Най-големият от тях е старият котлован на „Асарел-Медет“, снимки от който също можете да откриете в блога ни.\r\nСнимки и текст: https://otbivki.com/%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D1%82%D0%B5-%D0%BC%D0%B5%D1%81%D1%82%D0%B0-%D0%B2-%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/	t	0	42.3559725,24.3398573,15z	3	1	5	2022-04-12 10:07:07.352+00	Панагюрище	3	48	0
160	Тунелът на пътя Любовище – Рожен	Любовище – така се нарича едно малко известно пиринско село, което се намира само на 7 км от Мелник. А това, което виждате на снимката, е тунелът, който свързва с.Любовище с останалата част на света. Вероятността да сте минавали през него е минимална, защото селото се намира встрани от познатите туристически маршрути. За да попаднете там, трябва да отклоните вляво от пътя за Роженския манастир, който се намира наблизо.\r\nПодобни тунели има на много места в България. Най-много са в Родопите и по Искърското дефиле, където пътят често пресича огромни скални образувания. По-различното на тунела при село Любивище е, че пътят минава през един от многото „мелове“ в района (пирамидални образувания от пясъчно-глинести скали). След като веднъж се е любувал на тези красиви скали, най-малкото, което човек очаква, е да попадне в истински тунел през тях. Странно, но факт…\r\nСнимки и текст: https://otbivki.com/%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D1%82%D0%B5-%D0%BC%D0%B5%D1%81%D1%82%D0%B0-%D0%B2-%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/	t	0	41.53498639313963, 23.438761047054463	3	1	3	2022-04-12 10:08:48.668+00	Мелник	2	48	0
163	Харман кая	Светилището Харман кая би могло да предизвика интерес не по-малък от този към Перперикон и Татул. Единствената причина това да не се случи е, че то все още е слабо проучено, за разлика от другите две, които освен разучени, са и достатъчно рекламирани. За Харман кая това обстоятелство всъщност е добро. Липсата на тълпи от туристи тук  е запазила онова рядко усещане за тайнственост и уникалност, каквото доскоро можеше да се изпита на Белинташ и което все още цари край Глухите камъни. Според археолозите скалното плато Харман кая е не само светилище, то е цял град с улици, площади, помещения, които непрофесионалното око трудно би различило измежду избуялата трева и храсти наоколо. Ясно се е запазило и до днес личи светилището на скалния комплекс, пещерата в основата му и издълбаните във високите непристъпни скали ниши. В превод Харман кая означава равна скала, идва от „харман” – равен, като думата се използва и за двор, и „кая” – скала, използвана още за плато. Платото е с относително ниска надморска височина – 428 метра в най-високата му точка, но впечатлява с гледката, която се открива към околността и която вероятно обяснява причината това място да е избрано за светилище.\r\n\r\nПървите проучвания на обекта са правени още през 1941г. от проф. Васил Миков, който го определя като голям тракийски град, и ако днес започнатото от него дело бъде продължено, под разкопките на платото би изникнал град-светилище от ранга на Перперикон.Платото на Харман кая е природно укрепено и обградено със скали, в една от които се намира естествена пещера, наподобяваща утроба, с дълбочина от 7 метра. Днес тя се обитава от прилепи, а по скалите наоколо гнездят гарвани. Вътрешното свещено пространство включва скалистия връх с пещерата като в него се е влизало между скален процеп, допълнително оформен като вход и затварян с врата. Във външното свещено пространство са издълбани скални площадки, които са били използвани и като места за наблюдение на слънцето. Личат основите на помещения, стълби, скални ями и басейни, за които се спори дали са имали само битово предназначение (събиране и отвеждане на дъждовната вода) или са били използвани с ритуални цели (за жертвоприношения и обреди). На платото ясно са очертани две изравнени площадки – Големият и Малкият харман, по-голямата с диаметър около 15 метра и с 11 полукръга, леко наклонена на юг, а по-малката с диаметър около 10 метра и с 6 полукръга, наклоненна на север, и с диаметър на кръговете от 0.3 до 1.4 метра, който плавно се увеличава. Полукръговете и на двете са пресечени от врязани в скалите линии. Според някои площадките са били предназначени за жертвоприношения, но по-достоверни са теориите, според които са служели за измерване на годишния цикъл на времето и за установяване на лятното и зимното слънцестоене. Астрономическите наблюдения са били провеждани около 2000 г. пр. н.е. като се предполага, че са били част от ритуалните обреди по това време в култ към Бога – Слънце. Смята се, че извършваните свещенодействия са имали за цел освен съзерцаване и влияние върху космическите сили и осигуряване на плодородие.\r\n\r\nКаменно корито и щерни с преливници\r\n\r\nИздълбани са два трона – единият в западната част на малката площадка, а другият в северния край на голямата площадка, като и двата са обърнати в посока североизток. Запазени и до днес са щерните в скалите, шарапаните, изсечените стълби. Скалите на платото са с червеникав отенък, съставени от риолити и вулканичен туф. Харман кая е образуван в участък от Нановишката калдера. Преди милиони години районът е бил подложен на активна вулканична дейност, а тектоничните процеси обясняват напукванията в скалите и образуването на процепи в тях.\r\n\r\nКак се стига до Харман кая\r\n\r\nСветилището е разположено между Момчилградското село Биволяне и махалата му Долна Чобанка като по-удобен и лесен за него е пътят откъм Долна Чобанка, който освен това е и указан с табели още от Момчилград. От Момчилград тръгвате за с. Равен и продължавате за махала Долча Чобанка. След края на селото вдясно от пътя има табела, сочеща към платото. От нея по широк черен път ще стигнете до Харман кая.\r\n\r\nПо-трудно ще Ви бъде да намерите пещерата в основата на Харман кая. Тя е трудно достъпна и се намира в основата на по-ниска.\r\nСнимки и текст: https://keepliving.eu/kak-se-stiga-harman-kaya/	t	0	41.574465574215466, 25.519405300022893	3	1	4	2022-04-12 10:22:19.605+00	Кърджали	2	48	1
41	Иконостас "Свети Петър и Свети Никола"	Иконостасът се намира близо до Централния плаж на Черноморец. До него се стига по скали, които хората често използват за плаж. Има камбана и икони и всеки може да остави малък сувенир, за да разкраси иконостаса.	t	0	42.45013258985055, 27.641801076689354	4	2	4	2022-01-04 11:50:37.09+00	Черноморец	3	51	109
158	Будистка ступа край с. Плана	Будистката ступа край с. Плана е първата по рода си в България. Намира се на 35 км от София в южна посока и е построена през 2015-та година. Височината ѝ е 6.80 метра и е разположена на хълм, заобиколен от 360-градусов панорамен изглед към 4 планини – Витоша, Плана, Верила и Рила. Намиращите се в близост до монумента дървени постройки представляват Ретрит центъра на Плана, които предлагат усамотено място за медитиране на последователите на религията. Вярва се, че мястото навръх този хълм е високоенергийно и монументът символизира радостта и хармонията, които могат да бъдат постигнати чрез развиването на човешки качества като съчувствие и мъдрост.\r\n\r\nДумата ступа произлиза от санскрит и преведена буквално значи „куп“, „насип“. Будистките ступи са монументи с конусовидна или пирамидална форма. Фигурата им наподобява тялото на Буда в медитация, а във вътрешността на монумента всъщност се намира и медитиращата фигура на Буда. Ступата символизира напълно пробудения ум и съвършения баланс и хармония, намиращи се както в природата, така и в човека.\r\nИма 8 вида тибетски будистки ступи. Всяка от 8-те символизира ключов момент от живота на Буда. Тази в с. Плана е Ступа на Просветлението (Чан Чуб Чьортен на тибетски). Ступата на Просветлението символизира победата на принца Сидхарта Гаутама Буда над земните изкушения и атаките на демоничния небесен крал Мара под дървото Бодхи в Бодх Гая. Тази победа е моментът, в който принцът е постигнал духовно просветление в името на мир, хармония и благополучие.\r\n\r\nДокато бяхме там, един човек, който изглеждаше, че отговаря за поддръжката на околността, ни каза да си направим пожелание и да обиколим ступата в посока на часовниковата стрелка. Наистина, според будистките традиции ступите носят щастие и благополучие, и изпълняват желанията на хора с добри намерения. Те също служат да предпазват света от злини и бедствия.\r\n\r\nБудизмът е четвъртата най-разпространена религия в света. В България има под 1000 последователя, като най-многобройната будистка общност е Диамантения път на будизма с над 200 последователя. Именно тази общност е отговорна за построяването на ступата в с. Плана.\r\n\r\nГледката във всички посоки е възхитителна, въздухът е изключително свеж и чист.\r\nБудисткия монумент, извисяващ се физически, носи чувство на хармония и покой между ум и природа.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/budistka-stupa/	t	0	42.47966670177116, 23.407151858772462	3	1	3	2022-04-12 10:02:32.849+00	София	1	48	0
164	Крепост Моняк	Крепостта Моняк е разположена в Родопите, на 586 м надморска височина. Тя се намира на 11 км източно от гр. Кърджали, до с. Широко поле. Построена е през XII – XIII век. Тя е една от най-високо разположените и най-големи средновековни крепости в Родопите със защитена площ над 50 дка. Достъпът до нея е труден, защото теренът е стръмен, на места почти отвесен.\r\nКрепостта е имала важна стратегическа роля, тъй като е пазела прохода Железни врата и подстъпите на средновековния град, разположен около манастира „Свети Йоан Продром“, намиращ се в днешния град Кърджали.\r\nПрез 1206 г. крепостта е обсадена от латините по време на Четвъртия кръстоносен поход. Тук именно е коронясан за втори и последен император на Латинската империя Хенри (брат на загиналия Балдуин Фландърски).\r\nВеднъж стигнали до крепостта, пред очите на туристите се открива невероятна гледка към язовир „Студен кладенец” и град Кърджали. Преживяването си заслужава трудното изкачване.\r\nСнимки и текст: https://bulgariatravel.org/bg/%D0%BA%D1%80%D0%B5%D0%BF%D0%BE%D1%81%D1%82-%D0%BC%D0%BE%D0%BD%D1%8F%D0%BA-%D0%B3%D1%80%D0%B0%D0%B4-%D0%BA%D1%8A%D1%80%D0%B4%D0%B6%D0%B0%D0%BB%D0%B8/\r\n	t	0	41.62448355579104, 25.457700392673217	3	1	4	2022-04-12 10:31:48.475+00	Кърджали	3	48	0
78	Kъщата на семейство Каназиреви	Построена през далечната 1912 г. по проект на Карл Хайнрих за семейството на Пенчо Димитров. Скоро след това става собственост на семейство Каназиреви.\nКъщата е на 3 етажа, като за всеки има отделен вход с стълбище, както и още един 4ти вход (единственото стълбище, което минава през всички етажи, чак до таван ките помещения) от където слугите живеещи на тавана, са обслужвали всички етажи. На всеки от 3те етажа е живял по един от тримата братя Каназиреви. Имали са фабрики за сапун в София, Варна и Бургас. Едни от първите и малкото хора имали частен автомобил с шофьор, както и домашен телефон. Къщата е строена около 1912 година.\nВ наши дни сградата бе прекрасно реставрирана до старата си визия и гордо радва погледа на минувачите.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/430	t	0	42.70131575966223, 23.316520443063062	1	1	2	2022-01-30 13:30:42.498+00	София	1	48	11
40	Средогрив	Може да се стигне с кола, близък по-голям град е Видин. Селото е на около час от Видин. Може да се съчетае с разходка до Белоградчик.	t	0	43.55114191599291, 22.78351598356603	4	2	3	2022-01-03 16:06:18.115+00	Белоградчик	1	49	167
81	Червеният ресторант	Без да е с претенции за най-красива, тази сграда влезе в каталога главно поради причината, че рязко се откроява от останалите стари и неподдържани сгради наоколо. Тя е тук, за да покаже, че и спорен цвят и визия са по-добри от пълното отсъствие на такива.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/115	t	0	42.70152445178537, 23.330564332472516	1	1	2	2022-01-30 13:55:10.94+00	София	1	48	25
156	Крепост Цепина край с. Дорково	Крепостта Цепина се намира на близо 6 километра северно от село Дорково и е разположена на непристъпен хълм висок 1136 метра. Крепостта е достъпна единствено от южна страна, където минава и асфалтираният път, водещ до самото подножие на крепостта. Оттам следват 15-20 минути ходене по очертана и обезопасена пътека. От върха на крепостния хълм се открива невероятна панорамна гледка към Родопите, а в далечината на запад се вижда и малка част от Рила. Цялостното приказно усещане се подсилва и от многото крепостни останки. Личат разрушени зидове с дебелина от 1,6 до 2 метра. История лъха отвсякъде.\r\n\r\nРайонът на крепостта е била населявана още от 5-то хилядолетие пр.Хр. По-късно траките превръщат върха на хълма в светилище. Впоследствие християнското население построява на хълма голяма трикорабна базилика, а скоро след нея и значим манастирски комплекс, който се предполага, че е съществувал активно до около IX век.\r\n\r\nЦепина е част от Първото българско царство, но най-големият разцвет на града идва с началото на Втората българска държава. Цар Калоян присъединява крепостта към пределите на България в началото на XIII век. След смъртта му обаче, на престола сяда деспот Борил. Родопската област по това време е управлявана от Калояновия племенник – деспот Алексий Слав. Той се отмята от новия български владетел и се отделя като самостоятелен феодал с център крепостния град Цепина. Смята се, че по времето на деспот Слав крепостният град Цепина е съграден в по-мащабни размери, включващи вътрешна крепост (цитадела) и външна крепост. Около стените бързо възниква голямо селище, което бързо прераства в град. Укрепеният град и поградието при деспот Слав бързо се оформят като административен, стопански и културен център на Родопската област. В следните векове крепостта се връща обратно към българското царство. Към края на XIV век е превзета от османците след продължителна обсада от 9 месеца.\r\n\r\nПреди да се впуснете по пътеката, водеща към останките на основния крепостен средновековен град, в подножието на Цепина човек може да разгледа и музейната експозиция в сградата до паркинга, където пътят свършва. Експозицията представя детайлно историята и проучванията, свързани с крепостта.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/krepost-dorkovo/	t	0	42.087034,24.125086	3	1	4	2022-04-12 09:56:18.779+00	Пазараджик	1	48	0
157	Скална местност Скрибина	Скрибина е връх и местност разположена на 6 километра (40 минути поход пеша или 20 с джип, тъй като изкачването е по лек склон) от село Крибул в Западните Родопи край река Бистрица, и на около километър от местността Кара кая (Черната скала). Мястото е известно заради древното тракийско светилище на това място, носещо същото име. В този район на Родопите са често срещани скални арки (наричани от местното население „мушилки“, „промушилки“ и „провирачки“), но тази от местността Скрибина се отличава от всички останали с това, че се смята за целебна, лекуваща всички болести.\r\n\r\nСело Крибул е разположено в югозападна България, община Сатовча, област Благоевград. Самото селище е изключително древно. Признаци за това са намираните тракийски гробове от самите жители на селото, докато копаят градините си. Открити са и останки от еднокорабна църква от V век, около която е намерен и средновековен некропол. Предполага се, че Крибул е възникнал от обезлюденото село Букорово. Когато Османската империя превзема тези земи, местното население приема исляма, което е причината до наши дни то да се състои от българи-мохамедани.\r\n\r\nЗа скалната местност Скрибина, и специално „Провирачката“ се счита, че притежава лечебни сили. Тези посетили мястото, както и местната лечителка Юлия Земеделска, твърдят, че то притежава необяснима енергия, която въздейства на хората, а примерите за допреди това безнадеждно болни, обездвижени, преживели травма след катастрофа и впоследствие излекувани на това място, са десетки. Според легендата светилището се пази от огромна черна змия, наричана от местните „Сайбия“, която може да приема формата на други същества.\r\n\r\nТъй като змията е единственото животно в този регион, което систематично сменя кожата си, обновявайки се за по-хубав живот, част от ритуала, който се извършва на място, включва минаващия през „Провирачката“ да носи стари дрехи. Целта им е да поемат болката и/или болестта, която носи човека, и когато ритуалът приключи, те да бъдат вързани на дърво близо до камъка. Заради това гората наоколо е наричана „Гората от дрехи“. Тези дрехи не бива да бъдат пипани от друг, защото се смята, че който ги докосне ще вземе болестта/болката, която те съдържат. От друга страна, дрехите се носят и за да бъде болният максимално притиснат към скалата докато се промушва. Това се прави с цел той да се „съедини“ със скалата, за да бъде лечебният ефект максимален. Освен дрехите, за ритуала предварително се подготвя червен конец с дължината на болния човек, който се оставя на дървената стълба водеща към „Провирачката“. Болният минава през отвора на арката след „наричането“ от Лечителката. Желателно е да се оставят монети и предмети на специално отредено за това място. След това болният излиза от отвора и Лечителката прави кръг с конец около крака на болния и го запалва, като бае през времето, в което извършва тези действия. Следва още едно промушване през отвора и участникът в ритуала напуска сакралната територия.\r\nВъпросната лечителка е 77-годишната Юлия Земеделска, жителка на близкото село Крибул. Майка ѝ и сестра ѝ са били Лечителки преди нея, и дълги години са я убеждавали неуспешно да ги последва в това призвание. Преди години обаче се разболява тежко, и след няколко неуспешни хирургически намеси, сестра ѝ я води до скалата. По разказа на баба Юлия, както е известна сред хората, преди да мине през „Провирачката“ изрича молитва, в която се зарича, че ако оживее и оздравее след ритуала, ще се посвети на лечението на други изцяло. След последвалото чудо – оздравяването ѝ, тя остава вярна на обета си „да не върне никой“, и днес всеки ден се изкачва до скалата и извършва ритуала, за да помогне така, както на нея ѝ се е помогнало някога.\r\nСнимки и текст: http://nasledstvotonanaroda.bg/nature/preotkrii-bulgaria/skribina/	t	0	41.610052408419556, 23.939578470792846	3	1	4	2022-04-12 09:59:47.807+00	Благоевград	3	48	0
170	Кучешките къщи	На площад Журналист можете да видите кучешки къщи,	t	0	42.68121290195246, 23.33175884062632	6	1	2	2022-04-13 16:17:05.133+00	София	1	48	0
166	Тревистото езеро в Родопите	Смолянските езера са разположени по долината на Черна река, от Орфеевите скали и връх Снежанка до град Смолян. Преди време са били 20, но в настоящия момент са останали 8.\r\n\r\nТревистото езеро е най-голямото от Смолянските езера. Намира под Орфеевите скали, близо до връх Снежанка в Родопите. Близо една трета от езерото е покрито с дебел слой торф, върху който лятото изниква гъста трева. От тук идва и името му. Площта му е около 6 – 8 ха. Свързано е с речен ръкав с Бистрото езеро.\r\n\r\nОколо езерото има вековни иглолистни гори. Наблизо се намират и още две от Смолянските езера – Бистрото и Мътното езера. През лятото много хора къмпингуват тук. Наблизо се намира и седалковия лифт за връх Снежанка. От него има изградена екопътека до съседните езера. До езерото е изградена църквата Свети Дух.\r\n\r\nДо езерото се стига по асфалтов път. След като тръгнете от Смолян по посока Девин и Стойките, подминете квартал Езерово и след няколко километра има отбивка надясно. Преди да стигнете станцията за лифта за връх Снежанка ще видите езерото от дясната страна на пътя. Пътя от Смолян е около 10 км.\r\n\r\nНаблизо може да посетите село Стойките, Пампорово, Орфееви скали, Смолян, Бистрото езеро, Мътното езеро, Широка лъка, Връх Снежанка.\r\nСнимки и текст: https://rila.ws/тревистото-езеро-родопи-българия/	t	0	41.623682744260414, 24.679391673249928	3	1	3	2022-04-12 16:00:05.322+00	Смолян	2	48	1
165	Меандрите на река Арда	Меандрите на Арда са задължителна туристическа дестинация, ако пътувате в Източните Родопи. През годините са се превърнали в любимо място на фотографи и пътешественици и има защо. Гледките, на които можете да се насладите, наистина спират дъха, а самият път до тях също е много интересен и живописен. Причината за създаването на уникалните завои е ясно изразеният планински характер на реката.\r\n\r\nБезспорно най-известният, а може би и най-красивият меандър се намира между селата Стар читак и Рибарци. Мястото се нарича още „Завоя“ или „Подковата“ на язовир „Кърджали“ заради „U“-образната извивка, която водата прави. Всъщност тя се образува от различни притоци на язовира. Вляво е р. Арда, която се влива няколко километра по-нагоре, а вдясно р. Берковица. Любопитен факт е, че на отсрещния скалист полуостров се намират останките от крепостта „Патмос“.\r\n\r\nНа пътя Ардино – Кърджали хващате отбивката за село Боровица. Щом стигнете до селото, ще видите разклон. Завивате надясно към селата Стар Читак, Рибарци и Сухово.\r\nБъдете бдителни. По целия път свободно движат стада крави, които понякога се появяват изневиделица точно след някой завой. Карайте бавно и внимателно.\r\n\r\nМалко преди да пристигнете, ще започнете да виждате язовира. На място има разширение на пътя, където може да спрете колата си. Ще видите тясна пътека, която води надолу. След 2 минути пред вас ще се появи една от най-уникалните гледки в страната.\r\n\r\nОт горната страна на пътя също има пътека, от която може да наблюдавате гледката. В момента обаче тя е доста обрасла и не се вижда толкова добре.\r\n\r\nСнимки и текст: https://bulgarianontheroad.com/2021/05/31/zavoq-meandrite-na-arda/	t	0	41.6685791,25.2422676,15z	3	1	4	2022-04-12 15:49:33.76+00	Кърджали	2	48	1
162	Момин скок	Водопадът Момин скок се намира в живописния каньон на река Негованка край с.Емен, и е част от прекрасната Еменска екопътека. Водопадът е изключително красиво и романтично място, на което си заслужава да отидете с любим човек. Подходящо е и за пикник сред природата. Еменската пътека е лека и приятна за изминаване през всички сезони – пътят е около километър и половина, като се вие по ръба на каньона и предлага изумителни гледки към реката и скалите на отсрещния бряг. „Кулминацията“ на разходката е водопадът Момин скок, който е най-красив през пролетта (тогава реката е най-пълноводна). Има малък залив с каменист плаж и малка пещера, които придават на мястото особена романтика.\r\nСнимки и текст: https://otbivki.com/%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D1%82%D0%B5-%D0%BC%D0%B5%D1%81%D1%82%D0%B0-%D0%B2-%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/	t	0	43.14258973073962, 25.3713170443509	3	1	4	2022-04-12 10:13:51.236+00	Павликени	2	48	1
169	Ту-134	В Силистра, само на петдесетина метра от мястото, където се събират водната и сухоземната ни граница с Румъния, през 80-те години е поставен изразходвал ресурсите си пътнически самолет "Ту-134". Години наред аеропланът представлява атракция за силистренските деца. Постепенно обаче интересът към летателната машина и мястото около нея замира.\r\n\r\nСлед двуседмичен труд обаче повторното му откриване се превърна в празник за квартал "Самолета" и за цяла Силистра. Места за отдих, аерочиталня, изложба на самолети, спортни кътове са само част от нещата, на които могат да се насладят посетителите. Остава само и самолетът да бъде готов.\r\n\r\n"Ту-134" отново ще радва жителите на Силистра - 2\r\nВсичко това се случи в рамките на проект „The Spot/ _Място – Доброволчество с въздействие” на сдружение „BG Бъди Активен”. Идеята се реализира за втори път в България и използва подхода placemaking, вдъхновяващ хората колективно да преосмислят и преоткрият публичните пространства като средище на всяка общност.\r\n\r\n"Ту-134" отново ще радва жителите на Силистра - 3\r\nПо време на откриването на облагородената младежка зона се забавляваха малки и големи. Те участваха в състезателни игри с много награди, наблюдаваха с интерес атрактивни демонстрации, тестваха всички новоизградени съоръжения и кътове.\r\n\r\n"Ту-134" отново ще радва жителите на Силистра - 4\r\nВсички дейности бяха извършени с доброволен труд и с подкрепата на различни партньори, фирми и институции от Силистра. Привлечените доброволци от всички възрасти се трудиха неуморно, вложиха много енергия, творческа мисъл и въображение и за десет дни превърнаха неугледния терен в любимо място за занимания и отдих.\r\nСнимки и текст: https://fakti.bg/bulgaria/321047-tu-134-otnovo-shte-radva-jitelite-na-silistra | https://fakti.bg/bulgaria/321047-tu-134-otnovo-shte-radva-jitelite-na-silistra	t	0	44.12116232361195, 27.276120613319275	6	1	3	2022-04-12 16:33:13.719+00	Смолян	1	48	2
70	Космически подлез	След космоса в Научния подлез и спиралната галактика в Стълби към науката, видяхме колко интригуваща е темата за минувачите. Затова, когато се свързаха с нас от столичния район Триадица, тази тематика веднага изплува в съзнанието ни.\n\nВървейки по софийския бул. България минувачът може да се озове в 2 от нашите тематични подлези. След като се потопи в научните открития и постижения на човечеството в подлеза при ПГ по текстил и моден дизайн, човек е готов да отвори съзнанието си за тайните необятния космос, макар и поместени необичайно под земята в подлеза при бул. Гешов.\n\nДве обособени пана илюстрират вечната мечта на човека да достигне до звездите. Играта с яркостта на цветовете и светлината на изобразените космически пейзажи им придава мистичност и замечтаност. Това се потвърждава и от множеството снимки на минувачи, които получаваме, които се снимат до изобразения космонавт и си представят, че са с него.\n\nТекст и снимки: podlezno	t	0	42.67952798669243, 23.302043465350476	4	1	3	2022-01-29 20:52:17.244+00	София	1	48	39
85	Буровата банка	Построената на мястото на старата софийска поща сграда на някогашната Българска търговска банка е прекрасен архитектурен паметник на културата. Проектът е на реномираното бюро на архитектите Фингов, Ничев и Апостолов. Скулптурите в стил сецесион по фасадата са на Рихард Харди и Рамаданов. Монументалната група от деца и коленичили атланти около часовниковата кула са на Делирадев и Алексиев.\nСградата е построена по поръчка на именития банкер и политик Атанас Буров. Освен като банкер и финансист Буров се изявява и като виден политик, заемал постовете на министър на търговията, промишлеността и труда, а по-късно и на външните работи и изповеданията.\nСлед 23 декември 1947 г. банката и домът на Буров са национализирани и всички активи и пасиви преминават към ДЗИ. В по-ново време известната като банката на Буров сграда е прекрасно възстановена от сегашния си ползвател.\n\nСнимки и текст: https://www.altersofia.com/tr/buildings/building/366	t	0	42.69364228494735, 23.32252734110579	1	1	2	2022-01-30 14:20:25.196+00	София	1	48	86
\.


--
-- TOC entry 4128 (class 0 OID 1077787)
-- Dependencies: 214
-- Data for Name: replies_actions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."replies_actions" ("user_id", "reply_id", "action", "comment_id", "action_id", "date") FROM stdin;
\.


--
-- TOC entry 4130 (class 0 OID 1077805)
-- Dependencies: 216
-- Data for Name: reported_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."reported_items" ("item_id", "type", "reason", "date", "user_id", "report_id", "priority") FROM stdin;
\.


--
-- TOC entry 4132 (class 0 OID 1077821)
-- Dependencies: 218
-- Data for Name: savedPlaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."savedPlaces" ("user_id", "place_id", "date", "save_id") FROM stdin;
48	40	2022-01-27 08:23:56.149+00	8
48	53	2022-01-27 08:23:59.698+00	10
48	56	2022-01-27 08:24:02.354+00	11
48	55	2022-01-27 08:24:03.208+00	12
48	54	2022-01-27 08:24:04.189+00	13
48	57	2022-01-27 08:24:05.66+00	14
48	58	2022-01-27 08:24:06.73+00	15
48	59	2022-01-27 08:24:07.853+00	16
48	60	2022-01-27 08:24:09.393+00	17
48	51	2022-01-27 08:24:17.059+00	18
48	50	2022-01-27 08:24:18.043+00	19
48	52	2022-01-27 08:24:19.027+00	20
48	49	2022-01-27 08:24:20.606+00	21
48	47	2022-01-27 08:24:21.628+00	22
48	46	2022-01-27 08:24:23.248+00	23
48	44	2022-01-27 08:24:25.198+00	24
48	41	2022-02-09 13:50:25.119+00	65
163	41	2022-04-07 11:02:08.78+00	77
\.


--
-- TOC entry 4134 (class 0 OID 1077834)
-- Dependencies: 220
-- Data for Name: suggested_places; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."suggested_places" ("place_id", "title", "description", "placelocation", "category", "price", "accessibility", "dangerous", "suggested_user_id", "created_user_id", "id", "city") FROM stdin;
\.


--
-- TOC entry 4136 (class 0 OID 1077854)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4138 (class 0 OID 1077873)
-- Dependencies: 224
-- Data for Name: verification_actions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."verification_actions" ("verification_id", "user_id", "type", "url", "payload", "date") FROM stdin;
146	48	password-reset	073359a7e7947aae676fec21b72aa9e362a66c2056bbe24dd5c36d398d98114a109e79fc86166bdf3c91b37ce1a9721def1199ca50e9d78bb269ce9f067795a7d3043ba1d75fa58a23e725d5e3093d552e5f525f514156f8e409004af61dbe808fea7958	\N	2022-04-17T15:37:03.093+00:00
142	48	name	71be694391ed42f3f919f509799395a3590531e4492ae1b25eb7184640fa73b2d637f64ea8b38d811908505101dc23137bc039a1f05de504bda583c08ffecfe3207bd9b3680feeff2f55b134e0c8bc4a85a0e587f8bbefc469259acbb79d7552ca87ff2a	sdasdasdas	2022-02-11T21:35:22.591+00:00
\.


--
-- TOC entry 4158 (class 0 OID 0)
-- Dependencies: 203
-- Name: comments_actions_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."comments_actions_action_id_seq"', 103, true);


--
-- TOC entry 4159 (class 0 OID 0)
-- Dependencies: 204
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."comments_id_seq"', 49, true);


--
-- TOC entry 4160 (class 0 OID 0)
-- Dependencies: 206
-- Name: comments_replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."comments_replies_id_seq"', 47, true);


--
-- TOC entry 4161 (class 0 OID 0)
-- Dependencies: 208
-- Name: favoritePlaces_favorite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."favoritePlaces_favorite_id_seq"', 83, true);


--
-- TOC entry 4162 (class 0 OID 0)
-- Dependencies: 210
-- Name: images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."images_image_id_seq"', 296, true);


--
-- TOC entry 4163 (class 0 OID 0)
-- Dependencies: 213
-- Name: places_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."places_place_id_seq"', 170, true);


--
-- TOC entry 4164 (class 0 OID 0)
-- Dependencies: 215
-- Name: replies_actions_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."replies_actions_action_id_seq"', 53, true);


--
-- TOC entry 4165 (class 0 OID 0)
-- Dependencies: 217
-- Name: reported_items_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."reported_items_report_id_seq"', 51, true);


--
-- TOC entry 4166 (class 0 OID 0)
-- Dependencies: 219
-- Name: savedPlaces_save_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."savedPlaces_save_id_seq"', 79, true);


--
-- TOC entry 4167 (class 0 OID 0)
-- Dependencies: 221
-- Name: suggested_places_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."suggested_places_id_seq"', 42, true);


--
-- TOC entry 4168 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 166, true);


--
-- TOC entry 4169 (class 0 OID 0)
-- Dependencies: 225
-- Name: verification_actions_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."verification_actions_verification_id_seq"', 146, true);


--
-- TOC entry 3957 (class 2606 OID 1077980)
-- Name: verification_actions Verification_id uniqueness; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."verification_actions"
    ADD CONSTRAINT "Verification_id uniqueness" UNIQUE ("verification_id");


--
-- TOC entry 3963 (class 2606 OID 1353544)
-- Name: notes all; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "all" UNIQUE ("user_id", "place_id") INCLUDE ("user_id", "place_id");


--
-- TOC entry 3937 (class 2606 OID 1077982)
-- Name: comments comments_content_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_content_unique" UNIQUE ("content", "place_id") INCLUDE ("place_id", "content");


--
-- TOC entry 3939 (class 2606 OID 1077984)
-- Name: comments comments_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_unique" UNIQUE ("id");


--
-- TOC entry 3949 (class 2606 OID 1077986)
-- Name: users email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "email" UNIQUE ("email");


--
-- TOC entry 3951 (class 2606 OID 1077988)
-- Name: users id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "id" UNIQUE ("id");


--
-- TOC entry 3941 (class 2606 OID 1077990)
-- Name: comments_replies id of comments_replies; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_replies"
    ADD CONSTRAINT "id of comments_replies" UNIQUE ("id");


--
-- TOC entry 3959 (class 2606 OID 1077992)
-- Name: verification_actions payload; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."verification_actions"
    ADD CONSTRAINT "payload" UNIQUE ("payload");


--
-- TOC entry 3945 (class 2606 OID 1077994)
-- Name: places place_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "place_id" UNIQUE ("place_id");


--
-- TOC entry 3947 (class 2606 OID 1077996)
-- Name: reported_items reason_uniqueness; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reported_items"
    ADD CONSTRAINT "reason_uniqueness" UNIQUE ("reason") INCLUDE ("reason");


--
-- TOC entry 3943 (class 2606 OID 1077998)
-- Name: comments_replies unique replies; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_replies"
    ADD CONSTRAINT "unique replies" UNIQUE ("relating", "content") INCLUDE ("relating", "content");


--
-- TOC entry 3961 (class 2606 OID 1078000)
-- Name: verification_actions url; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."verification_actions"
    ADD CONSTRAINT "url" UNIQUE ("url");


--
-- TOC entry 3953 (class 2606 OID 1078002)
-- Name: users username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "username" UNIQUE ("username");


--
-- TOC entry 3955 (class 2606 OID 1078004)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("username", "id");


--
-- TOC entry 3968 (class 2606 OID 1078005)
-- Name: comments_replies comment_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_replies"
    ADD CONSTRAINT "comment_id" FOREIGN KEY ("relating") REFERENCES "public"."comments"("id");


--
-- TOC entry 3974 (class 2606 OID 1078010)
-- Name: replies_actions comment_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."replies_actions"
    ADD CONSTRAINT "comment_id" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") NOT VALID;


--
-- TOC entry 3966 (class 2606 OID 1078015)
-- Name: comments_actions comment_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_actions"
    ADD CONSTRAINT "comment_id" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id");


--
-- TOC entry 3972 (class 2606 OID 1078020)
-- Name: images place_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "place_id" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id");


--
-- TOC entry 3964 (class 2606 OID 1078025)
-- Name: comments place_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "place_id" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id");


--
-- TOC entry 3978 (class 2606 OID 1078030)
-- Name: savedPlaces place_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."savedPlaces"
    ADD CONSTRAINT "place_id" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id");


--
-- TOC entry 3970 (class 2606 OID 1078035)
-- Name: favoritePlaces place_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."favoritePlaces"
    ADD CONSTRAINT "place_id" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id");


--
-- TOC entry 3984 (class 2606 OID 1353545)
-- Name: notes place_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "place_id" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id") NOT VALID;


--
-- TOC entry 3975 (class 2606 OID 1078040)
-- Name: replies_actions reply_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."replies_actions"
    ADD CONSTRAINT "reply_id" FOREIGN KEY ("reply_id") REFERENCES "public"."comments_replies"("id") NOT VALID;


--
-- TOC entry 3965 (class 2606 OID 1078045)
-- Name: comments user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3969 (class 2606 OID 1078050)
-- Name: comments_replies user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_replies"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3976 (class 2606 OID 1078055)
-- Name: replies_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."replies_actions"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3967 (class 2606 OID 1078060)
-- Name: comments_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments_actions"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3977 (class 2606 OID 1078065)
-- Name: reported_items user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reported_items"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3979 (class 2606 OID 1078070)
-- Name: savedPlaces user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."savedPlaces"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3971 (class 2606 OID 1078075)
-- Name: favoritePlaces user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."favoritePlaces"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3982 (class 2606 OID 1078080)
-- Name: verification_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."verification_actions"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3973 (class 2606 OID 1078085)
-- Name: places user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") NOT VALID;


--
-- TOC entry 3983 (class 2606 OID 1353538)
-- Name: notes user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3980 (class 2606 OID 1078090)
-- Name: suggested_places user_id_created; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."suggested_places"
    ADD CONSTRAINT "user_id_created" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id");


--
-- TOC entry 3981 (class 2606 OID 1078095)
-- Name: suggested_places user_id_edited; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."suggested_places"
    ADD CONSTRAINT "user_id_edited" FOREIGN KEY ("suggested_user_id") REFERENCES "public"."users"("id");


-- Completed on 2022-08-28 16:59:33

--
-- PostgreSQL database dump complete
--

