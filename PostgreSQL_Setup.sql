CREATE DATABASE dbpgin5h2kcmte WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


CREATE TABLE public.comments (
    place_id bigint NOT NULL,
    user_id bigint NOT NULL,
    content character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    visible boolean NOT NULL,
    score bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.comments OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 201 (class 1259 OID 1077660)
-- Name: comments_actions; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.comments_actions (
    user_id bigint NOT NULL,
    comment_id bigint NOT NULL,
    action bigint NOT NULL,
    action_id bigint NOT NULL,
    date date
);


ALTER TABLE public.comments_actions OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 202 (class 1259 OID 1077663)
-- Name: comments_actions_action_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.comments_actions_action_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_actions_action_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4123 (class 0 OID 0)
-- Dependencies: 202
-- Name: comments_actions_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.comments_actions_action_id_seq OWNED BY public.comments_actions.action_id;


--
-- TOC entry 203 (class 1259 OID 1077675)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4124 (class 0 OID 0)
-- Dependencies: 203
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 204 (class 1259 OID 1077683)
-- Name: comments_replies; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.comments_replies (
    relating bigint NOT NULL,
    content character varying NOT NULL,
    user_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    visible boolean NOT NULL,
    score bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.comments_replies OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 205 (class 1259 OID 1077700)
-- Name: comments_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.comments_replies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_replies_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4125 (class 0 OID 0)
-- Dependencies: 205
-- Name: comments_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.comments_replies_id_seq OWNED BY public.comments_replies.id;


--
-- TOC entry 206 (class 1259 OID 1077707)
-- Name: favoritePlaces; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public."favoritePlaces" (
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    favorite_id bigint NOT NULL
);


ALTER TABLE public."favoritePlaces" OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 207 (class 1259 OID 1077717)
-- Name: favoritePlaces_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public."favoritePlaces_favorite_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."favoritePlaces_favorite_id_seq" OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4126 (class 0 OID 0)
-- Dependencies: 207
-- Name: favoritePlaces_favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public."favoritePlaces_favorite_id_seq" OWNED BY public."favoritePlaces".favorite_id;


--
-- TOC entry 208 (class 1259 OID 1077723)
-- Name: images; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.images (
    place_id bigint NOT NULL,
    url character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    image_id bigint NOT NULL,
    public_id character varying NOT NULL
);


ALTER TABLE public.images OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 209 (class 1259 OID 1077736)
-- Name: images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.images_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_image_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4127 (class 0 OID 0)
-- Dependencies: 209
-- Name: images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;


--
-- TOC entry 210 (class 1259 OID 1077742)
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.login_attempts (
    "user" character varying NOT NULL,
    ip character varying,
    "time" character varying NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 225 (class 1259 OID 1353532)
-- Name: notes; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.notes (
    user_id bigint,
    place_id bigint,
    note character varying
);


ALTER TABLE public.notes OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 211 (class 1259 OID 1077756)
-- Name: places; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.places (
    place_id bigint NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    visible boolean NOT NULL,
    score numeric NOT NULL,
    placelocation character varying NOT NULL,
    category numeric NOT NULL,
    price numeric NOT NULL,
    accessibility numeric NOT NULL,
    date timestamp with time zone NOT NULL,
    city character varying NOT NULL,
    dangerous bigint NOT NULL,
    user_id bigint,
    views bigint DEFAULT 0
);


ALTER TABLE public.places OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 212 (class 1259 OID 1077769)
-- Name: places_place_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.places_place_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.places_place_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4128 (class 0 OID 0)
-- Dependencies: 212
-- Name: places_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.places_place_id_seq OWNED BY public.places.place_id;


--
-- TOC entry 213 (class 1259 OID 1077787)
-- Name: replies_actions; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.replies_actions (
    user_id bigint NOT NULL,
    reply_id bigint NOT NULL,
    action bigint NOT NULL,
    comment_id bigint NOT NULL,
    action_id bigint NOT NULL,
    date date
);


ALTER TABLE public.replies_actions OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 214 (class 1259 OID 1077797)
-- Name: replies_actions_action_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.replies_actions_action_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.replies_actions_action_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4129 (class 0 OID 0)
-- Dependencies: 214
-- Name: replies_actions_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.replies_actions_action_id_seq OWNED BY public.replies_actions.action_id;


--
-- TOC entry 215 (class 1259 OID 1077805)
-- Name: reported_items; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.reported_items (
    item_id bigint NOT NULL,
    type character varying NOT NULL,
    reason character varying NOT NULL,
    date character varying NOT NULL,
    user_id bigint NOT NULL,
    report_id bigint NOT NULL,
    priority bigint NOT NULL
);


ALTER TABLE public.reported_items OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 216 (class 1259 OID 1077813)
-- Name: reported_items_report_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.reported_items_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reported_items_report_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4130 (class 0 OID 0)
-- Dependencies: 216
-- Name: reported_items_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.reported_items_report_id_seq OWNED BY public.reported_items.report_id;


--
-- TOC entry 217 (class 1259 OID 1077821)
-- Name: savedPlaces; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public."savedPlaces" (
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    save_id bigint NOT NULL
);


ALTER TABLE public."savedPlaces" OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 218 (class 1259 OID 1077826)
-- Name: savedPlaces_save_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public."savedPlaces_save_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."savedPlaces_save_id_seq" OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4131 (class 0 OID 0)
-- Dependencies: 218
-- Name: savedPlaces_save_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public."savedPlaces_save_id_seq" OWNED BY public."savedPlaces".save_id;


--
-- TOC entry 219 (class 1259 OID 1077834)
-- Name: suggested_places; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.suggested_places (
    place_id bigint,
    title character varying,
    description character varying,
    placelocation character varying,
    category numeric,
    price numeric,
    accessibility numeric,
    dangerous numeric,
    suggested_user_id bigint,
    created_user_id bigint,
    id bigint NOT NULL,
    city character varying
);


ALTER TABLE public.suggested_places OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 220 (class 1259 OID 1077842)
-- Name: suggested_places_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.suggested_places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suggested_places_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4132 (class 0 OID 0)
-- Dependencies: 220
-- Name: suggested_places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.suggested_places_id_seq OWNED BY public.suggested_places.id;


--
-- TOC entry 221 (class 1259 OID 1077854)
-- Name: users; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.users (
    username character varying NOT NULL,
    email character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    hash character varying NOT NULL,
    verified character varying NOT NULL,
    emailsent character varying NOT NULL,
    id bigint NOT NULL,
    avatar character varying,
    locked boolean DEFAULT false NOT NULL,
    admin boolean,
    avatar_public_id character varying
);


ALTER TABLE public.users OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 222 (class 1259 OID 1077863)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4133 (class 0 OID 0)
-- Dependencies: 222
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 223 (class 1259 OID 1077873)
-- Name: verification_actions; Type: TABLE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE TABLE public.verification_actions (
    verification_id bigint NOT NULL,
    user_id bigint,
    type character varying,
    url character varying,
    payload character varying,
    date character varying
);


ALTER TABLE public.verification_actions OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 224 (class 1259 OID 1077881)
-- Name: verification_actions_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: nvgcbtheqrjaqu
--

CREATE SEQUENCE public.verification_actions_verification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.verification_actions_verification_id_seq OWNER TO nvgcbtheqrjaqu;

--
-- TOC entry 4134 (class 0 OID 0)
-- Dependencies: 224
-- Name: verification_actions_verification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER SEQUENCE public.verification_actions_verification_id_seq OWNED BY public.verification_actions.verification_id;


--
-- TOC entry 3921 (class 2604 OID 1077889)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3922 (class 2604 OID 1077892)
-- Name: comments_actions action_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_actions ALTER COLUMN action_id SET DEFAULT nextval('public.comments_actions_action_id_seq'::regclass);


--
-- TOC entry 3923 (class 2604 OID 1077893)
-- Name: comments_replies id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_replies ALTER COLUMN id SET DEFAULT nextval('public.comments_replies_id_seq'::regclass);


--
-- TOC entry 3924 (class 2604 OID 1077902)
-- Name: favoritePlaces favorite_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."favoritePlaces" ALTER COLUMN favorite_id SET DEFAULT nextval('public."favoritePlaces_favorite_id_seq"'::regclass);


--
-- TOC entry 3925 (class 2604 OID 1077905)
-- Name: images image_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);


--
-- TOC entry 3926 (class 2604 OID 1077906)
-- Name: places place_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.places ALTER COLUMN place_id SET DEFAULT nextval('public.places_place_id_seq'::regclass);


--
-- TOC entry 3928 (class 2604 OID 1077907)
-- Name: replies_actions action_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.replies_actions ALTER COLUMN action_id SET DEFAULT nextval('public.replies_actions_action_id_seq'::regclass);


--
-- TOC entry 3929 (class 2604 OID 1077915)
-- Name: reported_items report_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.reported_items ALTER COLUMN report_id SET DEFAULT nextval('public.reported_items_report_id_seq'::regclass);


--
-- TOC entry 3930 (class 2604 OID 1077918)
-- Name: savedPlaces save_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."savedPlaces" ALTER COLUMN save_id SET DEFAULT nextval('public."savedPlaces_save_id_seq"'::regclass);


--
-- TOC entry 3931 (class 2604 OID 1077919)
-- Name: suggested_places id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.suggested_places ALTER COLUMN id SET DEFAULT nextval('public.suggested_places_id_seq'::regclass);


--
-- TOC entry 3933 (class 2604 OID 1077929)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3934 (class 2604 OID 1077932)
-- Name: verification_actions verification_id; Type: DEFAULT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.verification_actions ALTER COLUMN verification_id SET DEFAULT nextval('public.verification_actions_verification_id_seq'::regclass);


--
-- TOC entry 3956 (class 2606 OID 1077980)
-- Name: verification_actions Verification_id uniqueness; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.verification_actions
    ADD CONSTRAINT "Verification_id uniqueness" UNIQUE (verification_id);


--
-- TOC entry 3962 (class 2606 OID 1353544)
-- Name: notes all; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "all" UNIQUE (user_id, place_id) INCLUDE (user_id, place_id);


--
-- TOC entry 3936 (class 2606 OID 1077982)
-- Name: comments comments_content_unique; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_content_unique UNIQUE (content, place_id) INCLUDE (place_id, content);


--
-- TOC entry 3938 (class 2606 OID 1077984)
-- Name: comments comments_unique; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_unique UNIQUE (id);


--
-- TOC entry 3948 (class 2606 OID 1077986)
-- Name: users email; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 3950 (class 2606 OID 1077988)
-- Name: users id; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT id UNIQUE (id);


--
-- TOC entry 3940 (class 2606 OID 1077990)
-- Name: comments_replies id of comments_replies; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_replies
    ADD CONSTRAINT "id of comments_replies" UNIQUE (id);


--
-- TOC entry 3958 (class 2606 OID 1077992)
-- Name: verification_actions payload; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.verification_actions
    ADD CONSTRAINT payload UNIQUE (payload);


--
-- TOC entry 3944 (class 2606 OID 1077994)
-- Name: places place_id; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT place_id UNIQUE (place_id);


--
-- TOC entry 3946 (class 2606 OID 1077996)
-- Name: reported_items reason_uniqueness; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.reported_items
    ADD CONSTRAINT reason_uniqueness UNIQUE (reason) INCLUDE (reason);


--
-- TOC entry 3942 (class 2606 OID 1077998)
-- Name: comments_replies unique replies; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_replies
    ADD CONSTRAINT "unique replies" UNIQUE (relating, content) INCLUDE (relating, content);


--
-- TOC entry 3960 (class 2606 OID 1078000)
-- Name: verification_actions url; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.verification_actions
    ADD CONSTRAINT url UNIQUE (url);


--
-- TOC entry 3952 (class 2606 OID 1078002)
-- Name: users username; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT username UNIQUE (username);


--
-- TOC entry 3954 (class 2606 OID 1078004)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username, id);


--
-- TOC entry 3967 (class 2606 OID 1078005)
-- Name: comments_replies comment_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_replies
    ADD CONSTRAINT comment_id FOREIGN KEY (relating) REFERENCES public.comments(id);


--
-- TOC entry 3973 (class 2606 OID 1078010)
-- Name: replies_actions comment_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.replies_actions
    ADD CONSTRAINT comment_id FOREIGN KEY (comment_id) REFERENCES public.comments(id) NOT VALID;


--
-- TOC entry 3965 (class 2606 OID 1078015)
-- Name: comments_actions comment_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_actions
    ADD CONSTRAINT comment_id FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- TOC entry 3971 (class 2606 OID 1078020)
-- Name: images place_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES public.places(place_id);


--
-- TOC entry 3963 (class 2606 OID 1078025)
-- Name: comments place_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES public.places(place_id);


--
-- TOC entry 3977 (class 2606 OID 1078030)
-- Name: savedPlaces place_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."savedPlaces"
    ADD CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES public.places(place_id);


--
-- TOC entry 3969 (class 2606 OID 1078035)
-- Name: favoritePlaces place_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."favoritePlaces"
    ADD CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES public.places(place_id);


--
-- TOC entry 3983 (class 2606 OID 1353545)
-- Name: notes place_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES public.places(place_id) NOT VALID;


--
-- TOC entry 3974 (class 2606 OID 1078040)
-- Name: replies_actions reply_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.replies_actions
    ADD CONSTRAINT reply_id FOREIGN KEY (reply_id) REFERENCES public.comments_replies(id) NOT VALID;


--
-- TOC entry 3964 (class 2606 OID 1078045)
-- Name: comments user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3968 (class 2606 OID 1078050)
-- Name: comments_replies user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_replies
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3975 (class 2606 OID 1078055)
-- Name: replies_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.replies_actions
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3966 (class 2606 OID 1078060)
-- Name: comments_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.comments_actions
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3976 (class 2606 OID 1078065)
-- Name: reported_items user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.reported_items
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3978 (class 2606 OID 1078070)
-- Name: savedPlaces user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."savedPlaces"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3970 (class 2606 OID 1078075)
-- Name: favoritePlaces user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public."favoritePlaces"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3981 (class 2606 OID 1078080)
-- Name: verification_actions user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.verification_actions
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3972 (class 2606 OID 1078085)
-- Name: places user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3982 (class 2606 OID 1353538)
-- Name: notes user_id; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3979 (class 2606 OID 1078090)
-- Name: suggested_places user_id_created; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.suggested_places
    ADD CONSTRAINT user_id_created FOREIGN KEY (created_user_id) REFERENCES public.users(id);


--
-- TOC entry 3980 (class 2606 OID 1078095)
-- Name: suggested_places user_id_edited; Type: FK CONSTRAINT; Schema: public; Owner: nvgcbtheqrjaqu
--

ALTER TABLE ONLY public.suggested_places
    ADD CONSTRAINT user_id_edited FOREIGN KEY (suggested_user_id) REFERENCES public.users(id);


--
-- TOC entry 4120 (class 0 OID 0)
-- Dependencies: 4119
-- Name: DATABASE dbpgin5h2kcmte; Type: ACL; Schema: -; Owner: nvgcbtheqrjaqu
--

REVOKE CONNECT,TEMPORARY ON DATABASE dbpgin5h2kcmte FROM PUBLIC;


--
-- TOC entry 4121 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: nvgcbtheqrjaqu
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO nvgcbtheqrjaqu;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 4122 (class 0 OID 0)
-- Dependencies: 712
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO nvgcbtheqrjaqu;


-- Completed on 2022-02-08 18:19:25

--
-- PostgreSQL database dump complete
--

