BEGIN;


CREATE TABLE IF NOT EXISTS public.comments
(
    place_id bigint NOT NULL,
    user_id bigint NOT NULL,
    content character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    visible boolean NOT NULL,
    score bigint NOT NULL,
    id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public.comments_actions
(
    user_id bigint NOT NULL,
    comment_id bigint NOT NULL,
    action bigint NOT NULL,
    action_id bigint NOT NULL,
    date date
);

CREATE TABLE IF NOT EXISTS public.comments_replies
(
    relating bigint NOT NULL,
    content character varying NOT NULL,
    user_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    visible boolean NOT NULL,
    score bigint NOT NULL,
    id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public."favoritePlaces"
(
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    favorite_id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public.images
(
    place_id bigint NOT NULL,
    url character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    image_id bigint NOT NULL,
    public_id character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS public.login_attempts
(
    "user" character varying NOT NULL,
    ip character varying,
    "time" character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notes
(
    user_id bigint,
    place_id bigint,
    note character varying
);

CREATE TABLE IF NOT EXISTS public.places
(
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
    views bigint
);

CREATE TABLE IF NOT EXISTS public.replies_actions
(
    user_id bigint NOT NULL,
    reply_id bigint NOT NULL,
    action bigint NOT NULL,
    comment_id bigint NOT NULL,
    action_id bigint NOT NULL,
    date date
);

CREATE TABLE IF NOT EXISTS public.reported_items
(
    item_id bigint NOT NULL,
    type character varying NOT NULL,
    reason character varying NOT NULL,
    date character varying NOT NULL,
    user_id bigint NOT NULL,
    report_id bigint NOT NULL,
    priority bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public."savedPlaces"
(
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    save_id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public.suggested_places
(
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

CREATE TABLE IF NOT EXISTS public.users
(
    username character varying NOT NULL,
    email character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    hash character varying NOT NULL,
    verified character varying NOT NULL,
    emailsent character varying NOT NULL,
    id bigint NOT NULL,
    avatar character varying,
    locked boolean NOT NULL,
    admin boolean,
    avatar_public_id character varying,
    PRIMARY KEY (username, id)
);

CREATE TABLE IF NOT EXISTS public.verification_actions
(
    verification_id bigint NOT NULL,
    user_id bigint,
    type character varying,
    url character varying,
    payload character varying,
    date character varying
);

ALTER TABLE public.comments
    ADD FOREIGN KEY (place_id)
    REFERENCES public.places (place_id)
    NOT VALID;


ALTER TABLE public.comments
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.comments_actions
    ADD FOREIGN KEY (comment_id)
    REFERENCES public.comments (id)
    NOT VALID;


ALTER TABLE public.comments_actions
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.comments_replies
    ADD FOREIGN KEY (relating)
    REFERENCES public.comments (id)
    NOT VALID;


ALTER TABLE public.comments_replies
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public."favoritePlaces"
    ADD FOREIGN KEY (place_id)
    REFERENCES public.places (place_id)
    NOT VALID;


ALTER TABLE public."favoritePlaces"
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.images
    ADD FOREIGN KEY (place_id)
    REFERENCES public.places (place_id)
    NOT VALID;


ALTER TABLE public.login_attempts
    ADD FOREIGN KEY ("user")
    REFERENCES public.users (username)
    NOT VALID;


ALTER TABLE public.notes
    ADD FOREIGN KEY (place_id)
    REFERENCES public.places (place_id)
    NOT VALID;


ALTER TABLE public.notes
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.places
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.replies_actions
    ADD FOREIGN KEY (comment_id)
    REFERENCES public.comments (id)
    NOT VALID;


ALTER TABLE public.replies_actions
    ADD FOREIGN KEY (reply_id)
    REFERENCES public.comments_replies (id)
    NOT VALID;


ALTER TABLE public.replies_actions
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.reported_items
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public."savedPlaces"
    ADD FOREIGN KEY (place_id)
    REFERENCES public.places (place_id)
    NOT VALID;


ALTER TABLE public."savedPlaces"
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.suggested_places
    ADD FOREIGN KEY (created_user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.suggested_places
    ADD FOREIGN KEY (suggested_user_id)
    REFERENCES public.users (id)
    NOT VALID;


ALTER TABLE public.verification_actions
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    NOT VALID;

END;