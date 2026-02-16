--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: section; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.section (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    workspace_id uuid
);


ALTER TABLE public.section OWNER TO todoly_app_user;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.tag (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(64) NOT NULL,
    user_id uuid
);


ALTER TABLE public.tag OWNER TO todoly_app_user;

--
-- Name: task; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.task (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    linked_section uuid
);


ALTER TABLE public.task OWNER TO todoly_app_user;

--
-- Name: task_properties; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.task_properties (
    task_id uuid NOT NULL,
    title character varying(128) NOT NULL,
    due_date date,
    status character varying(15),
    subtasks jsonb,
    priority integer NOT NULL,
    user_id uuid NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    description text,
    recurrence jsonb DEFAULT '{"type":"none","days":[],"endDate":null}'::jsonb,
    is_overdue boolean DEFAULT false,
    reschedule_count integer DEFAULT 0,
    auto_reschedule_limit integer,
    auto_reschedule_enabled boolean DEFAULT true,
    last_rescheduled_at timestamp without time zone,
    last_completed_at timestamp without time zone,
    completion_count integer DEFAULT 0
);


ALTER TABLE public.task_properties OWNER TO todoly_app_user;

--
-- Name: task_workspaces; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.task_workspaces (
    task_id uuid NOT NULL,
    workspace_id uuid NOT NULL
);


ALTER TABLE public.task_workspaces OWNER TO todoly_app_user;

--
-- Name: task_activity; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE IF NOT EXISTS public.task_activity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    workspace_id uuid,
    event_type character varying(64) NOT NULL,
    event_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.task_activity OWNER TO todoly_app_user;

ALTER TABLE ONLY public.task_activity
    ADD CONSTRAINT task_activity_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.task(id) ON DELETE CASCADE;

--
-- Name: user_contact; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_contact (
    user_id uuid NOT NULL,
    email character varying(255),
    phone_number character varying(25)
);


ALTER TABLE public.user_contact OWNER TO todoly_app_user;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_preferences (
    user_id uuid NOT NULL,
    preference_key character varying(255) NOT NULL,
    preference_value character varying(255) NOT NULL
);


ALTER TABLE public.user_preferences OWNER TO todoly_app_user;

--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_profile (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(32),
    creation_date timestamp without time zone,
    first_name character varying(24),
    last_name character varying(24)
);


ALTER TABLE public.user_profile OWNER TO todoly_app_user;

--
-- Name: user_profile_image; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_profile_image (
    user_email character varying(255) NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE public.user_profile_image OWNER TO todoly_app_user;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_role (
    role_id integer NOT NULL,
    role_name character varying(24) NOT NULL
);


ALTER TABLE public.user_role OWNER TO todoly_app_user;

--
-- Name: user_role_assignment; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_role_assignment (
    user_id uuid NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.user_role_assignment OWNER TO todoly_app_user;

--
-- Name: user_role_assignments_role_id_seq; Type: SEQUENCE; Schema: public; Owner: todoly_app_user
--

CREATE SEQUENCE public.user_role_assignments_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_role_assignments_role_id_seq OWNER TO todoly_app_user;

--
-- Name: user_role_assignments_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todoly_app_user
--

ALTER SEQUENCE public.user_role_assignments_role_id_seq OWNED BY public.user_role_assignment.role_id;


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: todoly_app_user
--

CREATE SEQUENCE public.user_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_role_id_seq OWNER TO todoly_app_user;

--
-- Name: user_roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todoly_app_user
--

ALTER SEQUENCE public.user_roles_role_id_seq OWNED BY public.user_role.role_id;


--
-- Name: user_security; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_security (
    id uuid NOT NULL,
    password_hash character(60)
);


ALTER TABLE public.user_security OWNER TO todoly_app_user;

--
-- Name: user_subscription; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_subscription (
    user_id uuid NOT NULL,
    subscription_details jsonb
);


ALTER TABLE public.user_subscription OWNER TO todoly_app_user;

--
-- Name: user_workspaces; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.user_workspaces (
    user_id uuid NOT NULL,
    workspace_id uuid NOT NULL
);


ALTER TABLE public.user_workspaces OWNER TO todoly_app_user;

--
-- Name: workspace; Type: TABLE; Schema: public; Owner: todoly_app_user
--

CREATE TABLE public.workspace (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(64) NOT NULL
);


ALTER TABLE public.workspace OWNER TO todoly_app_user;

--
-- Name: user_role role_id; Type: DEFAULT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role ALTER COLUMN role_id SET DEFAULT nextval('public.user_roles_role_id_seq'::regclass);


--
-- Name: user_role_assignment role_id; Type: DEFAULT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role_assignment ALTER COLUMN role_id SET DEFAULT nextval('public.user_role_assignments_role_id_seq'::regclass);


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.section (id, name, user_id, workspace_id) FROM stdin;
d9e76554-60fc-4a3e-a703-dad8bdda4a39	Other	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
af3b99a8-78f3-44f1-a5fe-9dd3c200009b	Other	0ee28fa5-0cf9-470a-b388-7bc11733437d	716fef06-5bd6-4c81-ba32-8661f366409d
ac90f9c2-984b-4387-8d7a-3b55938bf001	Other	0ee28fa5-0cf9-470a-b388-7bc11733437d	95353988-6c0a-47bf-972b-74bbfdd03b66
ee9bb300-280f-4ce9-bc6c-aeb4ef3319fe	fgsd	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
a0d58ccf-2ff6-4dcf-9607-33f5529b3665	Other	4e541607-308c-462c-9f22-2d72d9bb9a41	630cd7c2-c11a-48ec-8ff9-fd93f7a357b9
654f001c-9305-48dd-95ed-d91f5f102c25	Other	fc781112-083d-4896-b50e-83ef92ef3376	0144354b-c9c4-4400-9400-09da6ebf4de1
a7695fb7-bf79-45b4-a05c-ce10442fa5c1	Other	ca753117-7d4a-4768-b1d1-3a9a6180b152	8058efea-6097-4a9d-80be-1375961efcc0
86f9ca70-97ec-419b-8c04-c3181cdbf241	Other	23aaff7d-47d0-4128-87d3-46c2def1e7b7	02eceab9-bb1d-42f7-bfe9-2f357c53584c
373b54d5-aee5-4a6e-ad1e-07b554d9a4b6	Other	166eb602-2281-4fc4-a51d-87f7a45fcd30	5e4b3da6-884e-406b-b5c5-54318bbd1815
6fd9f784-30f7-47ee-b089-0d2b04fdaeaa	Other	166eb602-2281-4fc4-a51d-87f7a45fcd30	53c67434-9802-44d7-9f0d-c9e7ecd5ea59
f9bf35a3-952b-4c02-9499-d9e9d6f088ff	Other	b2e56e76-baae-4071-870e-6b3ea1b7391c	d6aaaaaf-8e75-4b4d-b5c7-4980a0867037
4b09c9c2-31ff-4b15-aef8-07c0042ba045	Other	0777228e-1faf-4d2b-b02e-26c499bec803	7a338d96-8449-40b3-9303-fe66300ceabd
de72c4ae-458e-471a-b517-007cc237fcdf	Other	6dca1ffd-3552-42e7-86ef-48e8b56005a4	acf591a0-e221-4341-99a2-e67579bae641
3bafa594-2734-4584-bd98-ec4d535a74b3	Manger des lasagl	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
8abfa9f9-a13b-4063-bb04-4477a5ad13e5	Reading	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
321bded7-775e-4106-ac5d-993a45d45f70	Other	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
d861f96a-1d28-4cbe-988b-020edee0687e	Habits	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
4d144583-1384-4c26-a48f-e280c4a005c6	Health	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
ce81714d-c5df-430a-b57b-806202173c4a	Goals	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
ed4f0522-68e7-4e01-ab2b-e04449feaa02	Other	76773eeb-af47-4329-bbf5-0c6e7e3ab57e	c152c05a-5297-4d40-84c0-6c870fa594f4
7995ba32-2a8d-49d2-9a45-315fb0b9adf9	Other	2c7c3a2b-e99b-4aa2-9547-435ace035e4e	a02cd479-4a7b-4405-95bd-56513d447738
92bdc876-130c-4c6f-a6cf-146c7ecb0a15	Other	80c396c1-2f4f-499f-ae8e-ee070ba60077	bed66db1-1c6c-4915-a19b-560f99f249bb
5ad5f57c-5eb7-45e4-95a2-159aca143232	Other	e3652277-df40-4dd4-b630-2d15c834b061	78e740ff-49fd-4da9-a748-22f46ba94d48
4f14f1a0-722b-4b2f-b485-5f81ee9f4fc8	Other	ef8b9309-11e9-495c-a4e8-04760a52cfa6	fc8e28d5-5e68-4c6f-b98d-6b8fa172969f
9f74a6a6-2fc5-473d-bdd2-a4b385963bba	Other	9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	f16dcb58-e41f-4c53-9020-816707224284
45f1165e-84cf-4ffb-b6db-301ee61fe3a0	Other	f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	f158b802-8254-49f8-8261-38e839aff1c3
8b8f8bb1-b584-440f-8072-1b9680243bc0	Other	2ab2ba4f-3e38-43f8-ac07-a7628227e492	901df2c0-8884-4ba9-9fd1-ea9a832e55ea
bcc03f9d-0423-44b7-8e4c-7934b2c7645a	Other	ba57109f-da67-4c77-9ce0-1833bdd00d96	08f03b59-214d-44ac-b860-7ce83cda1178
e6c99d36-05fa-4668-aae4-21d9a3f64814	Other	4e2e2516-4736-43e3-8a1c-27ab2a93b883	dc90166f-de76-45a7-9dc5-8db4d542a100
2f89661f-4158-4ee3-8011-75c44b6fee84	Other	de6aaec9-61dd-4560-b335-da1d9e42831e	31e42b12-1cc9-463c-9928-91bb48215640
8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5	Other	0ee28fa5-0cf9-470a-b388-7bc11733437d	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
eafd8243-7655-41f8-9691-04d29076c923	Manipulation & Philosophie & Psychologie humaine	0ee28fa5-0cf9-470a-b388-7bc11733437d	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
05971040-a19e-4bfe-a284-d0b229fce228	Other	a0e3efa0-cea8-4160-91d7-07e14ebeeb22	2787de3c-4f51-4364-9a44-44a83e52de5b
46301282-72fe-43f2-b743-023490785929	Other	0a95c413-7baa-41f4-9343-b824132ce241	618d02cb-1fd9-4231-9782-50ef9f85729e
b7762dd2-aa00-4fba-9e73-14d98bdee2be	Français	0ee28fa5-0cf9-470a-b388-7bc11733437d	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
456aebf2-ba66-4d7a-b6ee-937c6d9861d6	Anglais	0ee28fa5-0cf9-470a-b388-7bc11733437d	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.tag (id, name, user_id) FROM stdin;
494a46d6-3c13-47dd-80e8-dded1536c2c2	test	b2e56e76-baae-4071-870e-6b3ea1b7391c
d7772441-3b1b-446a-a04f-4fbcf36ee8c5	#judo	80c396c1-2f4f-499f-ae8e-ee070ba60077
40e3d7c5-ac52-4d94-8411-8ba87521ef8b	important	2ab2ba4f-3e38-43f8-ac07-a7628227e492
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.task (id, user_id, creation_date, linked_section) FROM stdin;
053dac24-da37-4063-9bde-25a5bacd94af	166eb602-2281-4fc4-a51d-87f7a45fcd30	2024-08-07 18:48:52.41657	6fd9f784-30f7-47ee-b089-0d2b04fdaeaa
8f1e229a-3138-4184-a2fd-f197fbdd6a0e	b2e56e76-baae-4071-870e-6b3ea1b7391c	2024-08-08 20:58:08.408542	f9bf35a3-952b-4c02-9499-d9e9d6f088ff
933e3b1b-f495-44be-adb3-842539e0f1fc	80c396c1-2f4f-499f-ae8e-ee070ba60077	2024-08-14 14:38:59.194775	92bdc876-130c-4c6f-a6cf-146c7ecb0a15
ea0e4016-5a1e-40d0-8959-0342594bf2cd	0a95c413-7baa-41f4-9343-b824132ce241	2024-09-21 22:38:22.912896	46301282-72fe-43f2-b743-023490785929
4097b4f5-7855-4f32-a7d5-7915c1a0a803	0ee28fa5-0cf9-470a-b388-7bc11733437d	2024-10-11 20:04:58.986682	8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5
c3424b92-d52a-47e3-8ebe-3e23c55f4331	0ee28fa5-0cf9-470a-b388-7bc11733437d	2024-10-11 20:05:09.044451	8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5
fc38654a-31d4-496b-b93f-2182df5be74f	0ee28fa5-0cf9-470a-b388-7bc11733437d	2024-10-11 20:05:39.357521	8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5
acb63fab-caad-4199-b7d1-72cdbc23d261	0ee28fa5-0cf9-470a-b388-7bc11733437d	2024-10-11 20:06:25.653298	8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5
56a0f428-de5c-4844-a7d7-3f63ed00addf	0ee28fa5-0cf9-470a-b388-7bc11733437d	2024-10-11 20:06:35.323248	8d6bdfe7-cb39-42b4-8f67-8a6a21df46e5
\.


--
-- Data for Name: task_properties; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.task_properties (task_id, title, due_date, status, subtasks, priority, user_id, tags, description, recurrence) FROM stdin;
ea0e4016-5a1e-40d0-8959-0342594bf2cd	Coffee	2024-09-22	todo	\N	5	0a95c413-7baa-41f4-9343-b824132ce241	[]		{"type":"none","days":[],"endDate":null}
c3424b92-d52a-47e3-8ebe-3e23c55f4331	Work physique ++	2024-10-11	todo	\N	5	0ee28fa5-0cf9-470a-b388-7bc11733437d	[]		{"type":"none","days":[],"endDate":null}
fc38654a-31d4-496b-b93f-2182df5be74f	R?sumer cours et le rentrer | Ens. Sc. SVT	2024-10-11	todo	\N	5	0ee28fa5-0cf9-470a-b388-7bc11733437d	[]		{"type":"none","days":[],"endDate":null}
56a0f428-de5c-4844-a7d7-3f63ed00addf	?tre monstrueux pour de vrai en maths	2024-10-11	todo	\N	10	0ee28fa5-0cf9-470a-b388-7bc11733437d	[]		{"type":"none","days":[],"endDate":null}
acb63fab-caad-4199-b7d1-72cdbc23d261	Questions en histoire	2024-10-11	todo	\N	5	0ee28fa5-0cf9-470a-b388-7bc11733437d	[]		{"type":"none","days":[],"endDate":null}
053dac24-da37-4063-9bde-25a5bacd94af	18cm	2024-08-16	done	\N	10	166eb602-2281-4fc4-a51d-87f7a45fcd30	[]		{"type":"none","days":[],"endDate":null}
8f1e229a-3138-4184-a2fd-f197fbdd6a0e	ffdfd	2024-08-08	todo	\N	5	b2e56e76-baae-4071-870e-6b3ea1b7391c	[]		{"type":"none","days":[],"endDate":null}
933e3b1b-f495-44be-adb3-842539e0f1fc	Judo	2024-08-14	todo	\N	5	80c396c1-2f4f-499f-ae8e-ee070ba60077	[{"id": "d7772441-3b1b-446a-a04f-4fbcf36ee8c5", "name": "#judo", "user_id": "80c396c1-2f4f-499f-ae8e-ee070ba60077"}]		{"type":"none","days":[],"endDate":null}
4097b4f5-7855-4f32-a7d5-7915c1a0a803	Exos Physique	2024-10-11	todo	\N	8	0ee28fa5-0cf9-470a-b388-7bc11733437d	[]		{"type":"none","days":[],"endDate":null}
\.


--
-- Data for Name: task_workspaces; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.task_workspaces (task_id, workspace_id) FROM stdin;
053dac24-da37-4063-9bde-25a5bacd94af	53c67434-9802-44d7-9f0d-c9e7ecd5ea59
8f1e229a-3138-4184-a2fd-f197fbdd6a0e	d6aaaaaf-8e75-4b4d-b5c7-4980a0867037
933e3b1b-f495-44be-adb3-842539e0f1fc	bed66db1-1c6c-4915-a19b-560f99f249bb
ea0e4016-5a1e-40d0-8959-0342594bf2cd	618d02cb-1fd9-4231-9782-50ef9f85729e
4097b4f5-7855-4f32-a7d5-7915c1a0a803	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
c3424b92-d52a-47e3-8ebe-3e23c55f4331	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
fc38654a-31d4-496b-b93f-2182df5be74f	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
acb63fab-caad-4199-b7d1-72cdbc23d261	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
56a0f428-de5c-4844-a7d7-3f63ed00addf	6a87010a-4bf7-44e1-a0cc-9070c5cadb77
\.


--
-- Data for Name: user_contact; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_contact (user_id, email, phone_number) FROM stdin;
0ee28fa5-0cf9-470a-b388-7bc11733437d	bourgeois.louis.59240@gmail.com	\N
fc781112-083d-4896-b50e-83ef92ef3376	azerty@gmail.com	\N
ca753117-7d4a-4768-b1d1-3a9a6180b152	basti_guest@gmail.com	\N
23aaff7d-47d0-4128-87d3-46c2def1e7b7	bastiui_guest@gmail.com	\N
166eb602-2281-4fc4-a51d-87f7a45fcd30	lespire59240@gmail.com	\N
b2e56e76-baae-4071-870e-6b3ea1b7391c	poubellemail44100@gmail.com	\N
0777228e-1faf-4d2b-b02e-26c499bec803	brgs@gmail.com	\N
6dca1ffd-3552-42e7-86ef-48e8b56005a4	new_user@gmail.com	\N
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	djdiqo3ufh@gmail.com	\N
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	fdeffense@wanadoo.frf	\N
80c396c1-2f4f-499f-ae8e-ee070ba60077	devosdimitri9@gmail.com	\N
e3652277-df40-4dd4-b630-2d15c834b061	vuillermet.romane@gmail.com	\N
ef8b9309-11e9-495c-a4e8-04760a52cfa6	avxdidososo@gmail.com	\N
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	louis.bourgeois@proton.me	\N
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	parker060319@gmail.com	\N
2ab2ba4f-3e38-43f8-ac07-a7628227e492	lespireyt@gmail.com	\N
ba57109f-da67-4c77-9ce0-1833bdd00d96	loloetmimie1@gmail.com	\N
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Bourgeois.clementine10@gmail.com	\N
de6aaec9-61dd-4560-b335-da1d9e42831e	louis.bourgeois@ndd-dk.com	\N
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	detantsimon2@gmail.com	\N
0a95c413-7baa-41f4-9343-b824132ce241	vecchio.ks@gmail.com	\N
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_preferences (user_id, preference_key, preference_value) FROM stdin;
0ee28fa5-0cf9-470a-b388-7bc11733437d	Theme	Dark
0ee28fa5-0cf9-470a-b388-7bc11733437d	Do_Not_Show_Add_Scroll_Popup_Again	true
0ee28fa5-0cf9-470a-b388-7bc11733437d	Language	English
0ee28fa5-0cf9-470a-b388-7bc11733437d	TZ	America/New_York
0ee28fa5-0cf9-470a-b388-7bc11733437d	Last_Section	d9e76554-60fc-4a3e-a703-dad8bdda4a39
166eb602-2281-4fc4-a51d-87f7a45fcd30	Language	Français
166eb602-2281-4fc4-a51d-87f7a45fcd30	Default_Main_Page	Currently
166eb602-2281-4fc4-a51d-87f7a45fcd30	Last_Section	6fd9f784-30f7-47ee-b089-0d2b04fdaeaa
166eb602-2281-4fc4-a51d-87f7a45fcd30	Do_Not_Show_Add_Scroll_Popup_Again	true
166eb602-2281-4fc4-a51d-87f7a45fcd30	Current_Workspace	53c67434-9802-44d7-9f0d-c9e7ecd5ea59
166eb602-2281-4fc4-a51d-87f7a45fcd30	Color_Theme	black
166eb602-2281-4fc4-a51d-87f7a45fcd30	Date_Format	24h
b2e56e76-baae-4071-870e-6b3ea1b7391c	Default_Main_Page	Currently
166eb602-2281-4fc4-a51d-87f7a45fcd30	Show	All tasks
166eb602-2281-4fc4-a51d-87f7a45fcd30	Sort_By	Importance
b2e56e76-baae-4071-870e-6b3ea1b7391c	Home_Page_Title	Depending on the time of day + name
b2e56e76-baae-4071-870e-6b3ea1b7391c	Theme	Light
166eb602-2281-4fc4-a51d-87f7a45fcd30	Notifications_List	Daily Recap
b2e56e76-baae-4071-870e-6b3ea1b7391c	Color_Theme	#007aff
b2e56e76-baae-4071-870e-6b3ea1b7391c	Allow_Notifications	true
0777228e-1faf-4d2b-b02e-26c499bec803	Default_Main_Page	Currently
4e541607-308c-462c-9f22-2d72d9bb9a41	Default_Main_Page	Currently
4e541607-308c-462c-9f22-2d72d9bb9a41	Home_Page_Title	Depending on the time of day + name
4e541607-308c-462c-9f22-2d72d9bb9a41	Theme	Light
4e541607-308c-462c-9f22-2d72d9bb9a41	Color_Theme	#007aff
4e541607-308c-462c-9f22-2d72d9bb9a41	Allow_Notifications	true
4e541607-308c-462c-9f22-2d72d9bb9a41	Notifications_List	
4e541607-308c-462c-9f22-2d72d9bb9a41	Language	French
4e541607-308c-462c-9f22-2d72d9bb9a41	TZ	Europe/Paris
4e541607-308c-462c-9f22-2d72d9bb9a41	Date_Format	24h
4e541607-308c-462c-9f22-2d72d9bb9a41	Week_Starts_On	Monday
4e541607-308c-462c-9f22-2d72d9bb9a41	Current_Workspace	630cd7c2-c11a-48ec-8ff9-fd93f7a357b9
4e541607-308c-462c-9f22-2d72d9bb9a41	Last_Section	a0d58ccf-2ff6-4dcf-9607-33f5529b3665
4e541607-308c-462c-9f22-2d72d9bb9a41	Sort_By	Importance
4e541607-308c-462c-9f22-2d72d9bb9a41	Show	All tasks
fc781112-083d-4896-b50e-83ef92ef3376	Default_Main_Page	Currently
fc781112-083d-4896-b50e-83ef92ef3376	Home_Page_Title	Depending on the time of day + name
fc781112-083d-4896-b50e-83ef92ef3376	Theme	Light
fc781112-083d-4896-b50e-83ef92ef3376	Color_Theme	#007aff
fc781112-083d-4896-b50e-83ef92ef3376	Allow_Notifications	true
fc781112-083d-4896-b50e-83ef92ef3376	Notifications_List	
fc781112-083d-4896-b50e-83ef92ef3376	Language	French
fc781112-083d-4896-b50e-83ef92ef3376	TZ	Europe/Paris
fc781112-083d-4896-b50e-83ef92ef3376	Date_Format	24h
fc781112-083d-4896-b50e-83ef92ef3376	Week_Starts_On	Monday
fc781112-083d-4896-b50e-83ef92ef3376	Current_Workspace	0144354b-c9c4-4400-9400-09da6ebf4de1
fc781112-083d-4896-b50e-83ef92ef3376	Last_Section	654f001c-9305-48dd-95ed-d91f5f102c25
fc781112-083d-4896-b50e-83ef92ef3376	Sort_By	Importance
fc781112-083d-4896-b50e-83ef92ef3376	Show	All tasks
ca753117-7d4a-4768-b1d1-3a9a6180b152	Default_Main_Page	Currently
ca753117-7d4a-4768-b1d1-3a9a6180b152	Home_Page_Title	Depending on the time of day + name
ca753117-7d4a-4768-b1d1-3a9a6180b152	Theme	Light
ca753117-7d4a-4768-b1d1-3a9a6180b152	Color_Theme	#007aff
ca753117-7d4a-4768-b1d1-3a9a6180b152	Allow_Notifications	true
ca753117-7d4a-4768-b1d1-3a9a6180b152	Notifications_List	
ca753117-7d4a-4768-b1d1-3a9a6180b152	Language	French
ca753117-7d4a-4768-b1d1-3a9a6180b152	TZ	Europe/Paris
ca753117-7d4a-4768-b1d1-3a9a6180b152	Date_Format	24h
ca753117-7d4a-4768-b1d1-3a9a6180b152	Week_Starts_On	Monday
ca753117-7d4a-4768-b1d1-3a9a6180b152	Current_Workspace	8058efea-6097-4a9d-80be-1375961efcc0
ca753117-7d4a-4768-b1d1-3a9a6180b152	Last_Section	a7695fb7-bf79-45b4-a05c-ce10442fa5c1
ca753117-7d4a-4768-b1d1-3a9a6180b152	Sort_By	Importance
ca753117-7d4a-4768-b1d1-3a9a6180b152	Show	All tasks
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Default_Main_Page	Currently
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Home_Page_Title	Depending on the time of day + name
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Theme	Light
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Language	French
23aaff7d-47d0-4128-87d3-46c2def1e7b7	TZ	Europe/Paris
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Date_Format	24h
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Week_Starts_On	Monday
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Current_Workspace	02eceab9-bb1d-42f7-bfe9-2f357c53584c
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Last_Section	86f9ca70-97ec-419b-8c04-c3181cdbf241
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Sort_By	Importance
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Show	All tasks
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Do_Not_Show_Add_Scroll_Popup_Again	true
166eb602-2281-4fc4-a51d-87f7a45fcd30	Home_Page_Title	Depending on the time of day + name
166eb602-2281-4fc4-a51d-87f7a45fcd30	Theme	Light
166eb602-2281-4fc4-a51d-87f7a45fcd30	Allow_Notifications	true
166eb602-2281-4fc4-a51d-87f7a45fcd30	TZ	Europe/Paris
166eb602-2281-4fc4-a51d-87f7a45fcd30	Week_Starts_On	Monday
b2e56e76-baae-4071-870e-6b3ea1b7391c	Notifications_List	
b2e56e76-baae-4071-870e-6b3ea1b7391c	Language	French
b2e56e76-baae-4071-870e-6b3ea1b7391c	TZ	Europe/Paris
b2e56e76-baae-4071-870e-6b3ea1b7391c	Date_Format	24h
b2e56e76-baae-4071-870e-6b3ea1b7391c	Week_Starts_On	Monday
b2e56e76-baae-4071-870e-6b3ea1b7391c	Show	All tasks
b2e56e76-baae-4071-870e-6b3ea1b7391c	Current_Workspace	d6aaaaaf-8e75-4b4d-b5c7-4980a0867037
b2e56e76-baae-4071-870e-6b3ea1b7391c	Sort_By	Importance
b2e56e76-baae-4071-870e-6b3ea1b7391c	Last_Section	f9bf35a3-952b-4c02-9499-d9e9d6f088ff
0ee28fa5-0cf9-470a-b388-7bc11733437d	Current_Workspace	cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7
0ee28fa5-0cf9-470a-b388-7bc11733437d	Default_Main_Page	Currently
0777228e-1faf-4d2b-b02e-26c499bec803	Home_Page_Title	Depending on the time of day + name
0777228e-1faf-4d2b-b02e-26c499bec803	Theme	Light
0777228e-1faf-4d2b-b02e-26c499bec803	Color_Theme	#007aff
0777228e-1faf-4d2b-b02e-26c499bec803	Allow_Notifications	true
0777228e-1faf-4d2b-b02e-26c499bec803	Notifications_List	
0777228e-1faf-4d2b-b02e-26c499bec803	Language	French
0777228e-1faf-4d2b-b02e-26c499bec803	TZ	Europe/Paris
ba57109f-da67-4c77-9ce0-1833bdd00d96	Default_Main_Page	Currently
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Color_Theme	#000000
0777228e-1faf-4d2b-b02e-26c499bec803	Week_Starts_On	Monday
0777228e-1faf-4d2b-b02e-26c499bec803	Current_Workspace	7a338d96-8449-40b3-9303-fe66300ceabd
0777228e-1faf-4d2b-b02e-26c499bec803	Last_Section	4b09c9c2-31ff-4b15-aef8-07c0042ba045
0ee28fa5-0cf9-470a-b388-7bc11733437d	Date_Format	24h
0ee28fa5-0cf9-470a-b388-7bc11733437d	Sort_By	Last updated
0ee28fa5-0cf9-470a-b388-7bc11733437d	Home_Page_Title	default
0ee28fa5-0cf9-470a-b388-7bc11733437d	Show	Completed only
0777228e-1faf-4d2b-b02e-26c499bec803	Sort_By	Importance
0777228e-1faf-4d2b-b02e-26c499bec803	Show	All tasks
0777228e-1faf-4d2b-b02e-26c499bec803	Date_Format	12h
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Default_Main_Page	Currently
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Home_Page_Title	Depending on the time of day + name
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Theme	Light
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Allow_Notifications	true
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Notifications_List	
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Language	French
6dca1ffd-3552-42e7-86ef-48e8b56005a4	TZ	Europe/Paris
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Date_Format	24h
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Week_Starts_On	Monday
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Current_Workspace	acf591a0-e221-4341-99a2-e67579bae641
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Last_Section	de72c4ae-458e-471a-b517-007cc237fcdf
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Sort_By	Importance
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Show	All tasks
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Do_Not_Show_Add_Scroll_Popup_Again	true
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Default_Main_Page	Currently
6dca1ffd-3552-42e7-86ef-48e8b56005a4	Color_Theme	pink
ba57109f-da67-4c77-9ce0-1833bdd00d96	Home_Page_Title	Depending on the time of day + name
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Language	English
ba57109f-da67-4c77-9ce0-1833bdd00d96	Theme	Dark
ba57109f-da67-4c77-9ce0-1833bdd00d96	Color_Theme	#000000
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Color_Theme	#ffffff
ba57109f-da67-4c77-9ce0-1833bdd00d96	Allow_Notifications	true
ba57109f-da67-4c77-9ce0-1833bdd00d96	Notifications_List	
ba57109f-da67-4c77-9ce0-1833bdd00d96	Language	French
ba57109f-da67-4c77-9ce0-1833bdd00d96	TZ	Europe/Paris
ba57109f-da67-4c77-9ce0-1833bdd00d96	Date_Format	24h
ba57109f-da67-4c77-9ce0-1833bdd00d96	Week_Starts_On	Monday
ba57109f-da67-4c77-9ce0-1833bdd00d96	Current_Workspace	08f03b59-214d-44ac-b860-7ce83cda1178
ba57109f-da67-4c77-9ce0-1833bdd00d96	Last_Section	bcc03f9d-0423-44b7-8e4c-7934b2c7645a
ba57109f-da67-4c77-9ce0-1833bdd00d96	Sort_By	Importance
ba57109f-da67-4c77-9ce0-1833bdd00d96	Show	All tasks
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Allow_Notifications	true
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Default_Main_Page	Currently
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Home_Page_Title	Depending on the time of day + name
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Theme	Dark
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Allow_Notifications	true
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Notifications_List	
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Language	French
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	TZ	Europe/Paris
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Date_Format	24h
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Week_Starts_On	Monday
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Current_Workspace	2787de3c-4f51-4364-9a44-44a83e52de5b
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Last_Section	05971040-a19e-4bfe-a284-d0b229fce228
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Sort_By	Importance
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Show	All tasks
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Color_Theme	#000000
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Default_Main_Page	Currently
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Home_Page_Title	Depending on the time of day + name
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Theme	Dark
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Color_Theme	#000000
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Allow_Notifications	true
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Notifications_List	
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Language	French
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	TZ	Europe/Paris
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Date_Format	24h
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Week_Starts_On	Monday
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Current_Workspace	c152c05a-5297-4d40-84c0-6c870fa594f4
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Last_Section	ed4f0522-68e7-4e01-ab2b-e04449feaa02
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Sort_By	Importance
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	Show	All tasks
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Home_Page_Title	Depending on the time of day + name
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Theme	Dark
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Allow_Notifications	true
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Notifications_List	
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	TZ	Europe/Paris
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Date_Format	24h
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Week_Starts_On	Monday
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Current_Workspace	a02cd479-4a7b-4405-95bd-56513d447738
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Last_Section	7995ba32-2a8d-49d2-9a45-315fb0b9adf9
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Sort_By	Importance
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Show	All tasks
80c396c1-2f4f-499f-ae8e-ee070ba60077	Default_Main_Page	Currently
80c396c1-2f4f-499f-ae8e-ee070ba60077	Home_Page_Title	Depending on the time of day + name
80c396c1-2f4f-499f-ae8e-ee070ba60077	Theme	Dark
80c396c1-2f4f-499f-ae8e-ee070ba60077	Allow_Notifications	true
80c396c1-2f4f-499f-ae8e-ee070ba60077	Notifications_List	
80c396c1-2f4f-499f-ae8e-ee070ba60077	Language	French
80c396c1-2f4f-499f-ae8e-ee070ba60077	TZ	Europe/Paris
80c396c1-2f4f-499f-ae8e-ee070ba60077	Date_Format	24h
80c396c1-2f4f-499f-ae8e-ee070ba60077	Week_Starts_On	Monday
80c396c1-2f4f-499f-ae8e-ee070ba60077	Current_Workspace	bed66db1-1c6c-4915-a19b-560f99f249bb
80c396c1-2f4f-499f-ae8e-ee070ba60077	Last_Section	92bdc876-130c-4c6f-a6cf-146c7ecb0a15
80c396c1-2f4f-499f-ae8e-ee070ba60077	Sort_By	Importance
80c396c1-2f4f-499f-ae8e-ee070ba60077	Show	All tasks
80c396c1-2f4f-499f-ae8e-ee070ba60077	Do_Not_Show_Add_Scroll_Popup_Again	true
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Default_Main_Page	All
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Home_Page_Title	Bisous les reufs
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Color_Theme	#ffffff
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Color_Theme	#000000
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Week_Starts_On	Monday
0a95c413-7baa-41f4-9343-b824132ce241	Default_Main_Page	Currently
80c396c1-2f4f-499f-ae8e-ee070ba60077	Color_Theme	#000000
e3652277-df40-4dd4-b630-2d15c834b061	Default_Main_Page	Currently
e3652277-df40-4dd4-b630-2d15c834b061	Home_Page_Title	Depending on the time of day + name
e3652277-df40-4dd4-b630-2d15c834b061	Theme	Dark
e3652277-df40-4dd4-b630-2d15c834b061	Allow_Notifications	true
e3652277-df40-4dd4-b630-2d15c834b061	Language	French
e3652277-df40-4dd4-b630-2d15c834b061	TZ	Europe/Paris
e3652277-df40-4dd4-b630-2d15c834b061	Date_Format	24h
e3652277-df40-4dd4-b630-2d15c834b061	Current_Workspace	78e740ff-49fd-4da9-a748-22f46ba94d48
e3652277-df40-4dd4-b630-2d15c834b061	Last_Section	5ad5f57c-5eb7-45e4-95a2-159aca143232
e3652277-df40-4dd4-b630-2d15c834b061	Sort_By	Importance
e3652277-df40-4dd4-b630-2d15c834b061	Show	All tasks
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Date_Format	24h
23aaff7d-47d0-4128-87d3-46c2def1e7b7	Notifications_List	
0a95c413-7baa-41f4-9343-b824132ce241	Home_Page_Title	Depending on the time of day + name
0a95c413-7baa-41f4-9343-b824132ce241	Theme	Dark
0a95c413-7baa-41f4-9343-b824132ce241	Color_Theme	#000000
0a95c413-7baa-41f4-9343-b824132ce241	Allow_Notifications	true
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Show	All tasks
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Sort_By	Importance
e3652277-df40-4dd4-b630-2d15c834b061	Notifications_List	Daily Recap,Weekly Recap,Monthly Recap
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Last_Section	8b8f8bb1-b584-440f-8072-1b9680243bc0
e3652277-df40-4dd4-b630-2d15c834b061	Week_Starts_On	Monday
e3652277-df40-4dd4-b630-2d15c834b061	Do_Not_Show_Add_Scroll_Popup_Again	true
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Default_Main_Page	Currently
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Home_Page_Title	Depending on the time of day + name
e3652277-df40-4dd4-b630-2d15c834b061	Color_Theme	#000000
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Default_Main_Page	Currently
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Home_Page_Title	Depending on the time of day + name
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Theme	Dark
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Color_Theme	#000000
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Allow_Notifications	true
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Notifications_List	
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Language	French
ef8b9309-11e9-495c-a4e8-04760a52cfa6	TZ	Europe/Paris
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Date_Format	24h
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Week_Starts_On	Monday
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Current_Workspace	fc8e28d5-5e68-4c6f-b98d-6b8fa172969f
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Last_Section	4f14f1a0-722b-4b2f-b485-5f81ee9f4fc8
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Sort_By	Importance
ef8b9309-11e9-495c-a4e8-04760a52cfa6	Show	All tasks
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Default_Main_Page	Currently
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Home_Page_Title	Depending on the time of day + name
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Theme	Dark
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Color_Theme	#000000
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Allow_Notifications	true
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Notifications_List	
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Language	French
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	TZ	Europe/Paris
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Date_Format	24h
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Week_Starts_On	Monday
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Current_Workspace	f16dcb58-e41f-4c53-9020-816707224284
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Last_Section	9f74a6a6-2fc5-473d-bdd2-a4b385963bba
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Sort_By	Importance
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Show	All tasks
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Default_Main_Page	Currently
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Home_Page_Title	Depending on the time of day + name
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Theme	Dark
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Color_Theme	#000000
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Allow_Notifications	true
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Notifications_List	
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Language	French
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	TZ	Europe/Paris
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Date_Format	24h
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Week_Starts_On	Monday
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Current_Workspace	f158b802-8254-49f8-8261-38e839aff1c3
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Last_Section	45f1165e-84cf-4ffb-b6db-301ee61fe3a0
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Sort_By	Importance
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Show	All tasks
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Do_Not_Show_Add_Scroll_Popup_Again	true
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Theme	Dark
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Theme	Dark
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Language	French
2ab2ba4f-3e38-43f8-ac07-a7628227e492	TZ	Europe/Paris
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Current_Workspace	901df2c0-8884-4ba9-9fd1-ea9a832e55ea
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Allow_Notifications	true
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Notifications_List	
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Language	French
4e2e2516-4736-43e3-8a1c-27ab2a93b883	TZ	Europe/Paris
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Date_Format	24h
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Week_Starts_On	Monday
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Current_Workspace	dc90166f-de76-45a7-9dc5-8db4d542a100
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Last_Section	e6c99d36-05fa-4668-aae4-21d9a3f64814
0a95c413-7baa-41f4-9343-b824132ce241	Notifications_List	
0a95c413-7baa-41f4-9343-b824132ce241	Language	French
0a95c413-7baa-41f4-9343-b824132ce241	TZ	Europe/Paris
0a95c413-7baa-41f4-9343-b824132ce241	Date_Format	24h
0a95c413-7baa-41f4-9343-b824132ce241	Week_Starts_On	Monday
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Sort_By	Importance
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Show	All tasks
0a95c413-7baa-41f4-9343-b824132ce241	Current_Workspace	618d02cb-1fd9-4231-9782-50ef9f85729e
0a95c413-7baa-41f4-9343-b824132ce241	Last_Section	46301282-72fe-43f2-b743-023490785929
0a95c413-7baa-41f4-9343-b824132ce241	Sort_By	Importance
0a95c413-7baa-41f4-9343-b824132ce241	Show	All tasks
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Allow_Notifications	true
4e2e2516-4736-43e3-8a1c-27ab2a93b883	Do_Not_Show_Add_Scroll_Popup_Again	true
de6aaec9-61dd-4560-b335-da1d9e42831e	Default_Main_Page	Currently
de6aaec9-61dd-4560-b335-da1d9e42831e	Home_Page_Title	Depending on the time of day + name
de6aaec9-61dd-4560-b335-da1d9e42831e	Theme	Dark
de6aaec9-61dd-4560-b335-da1d9e42831e	Language	French
de6aaec9-61dd-4560-b335-da1d9e42831e	TZ	Europe/Paris
de6aaec9-61dd-4560-b335-da1d9e42831e	Date_Format	24h
de6aaec9-61dd-4560-b335-da1d9e42831e	Current_Workspace	31e42b12-1cc9-463c-9928-91bb48215640
de6aaec9-61dd-4560-b335-da1d9e42831e	Last_Section	2f89661f-4158-4ee3-8011-75c44b6fee84
de6aaec9-61dd-4560-b335-da1d9e42831e	Sort_By	Importance
de6aaec9-61dd-4560-b335-da1d9e42831e	Show	All tasks
de6aaec9-61dd-4560-b335-da1d9e42831e	Color_Theme	#000000
de6aaec9-61dd-4560-b335-da1d9e42831e	Allow_Notifications	false
de6aaec9-61dd-4560-b335-da1d9e42831e	Notifications_List	
de6aaec9-61dd-4560-b335-da1d9e42831e	Week_Starts_On	Sunday
2ab2ba4f-3e38-43f8-ac07-a7628227e492	Notifications_List	
0ee28fa5-0cf9-470a-b388-7bc11733437d	Week_Starts_On	Monday
0ee28fa5-0cf9-470a-b388-7bc11733437d	Allow_Notifications	false
0ee28fa5-0cf9-470a-b388-7bc11733437d	Notifications_List	
0ee28fa5-0cf9-470a-b388-7bc11733437d	Color_Theme	#000000
\.


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_profile (id, username, creation_date, first_name, last_name) FROM stdin;
0ee28fa5-0cf9-470a-b388-7bc11733437d	louis	2024-02-26 19:50:28.1	Louis	Bourgeois
4e541607-308c-462c-9f22-2d72d9bb9a41	dzddxahd	2024-08-07 09:19:06.454	dzddxahd	dzddxahd
fc781112-083d-4896-b50e-83ef92ef3376	guest001	2024-08-07 13:17:09.411	guest	guest
ca753117-7d4a-4768-b1d1-3a9a6180b152	guest	2024-08-07 13:39:50.87	Jeune entrepreneur	GUEST
23aaff7d-47d0-4128-87d3-46c2def1e7b7	bastiui_guest	2024-08-07 13:41:22.768	guest	guest
166eb602-2281-4fc4-a51d-87f7a45fcd30	leSpire2062	2024-08-07 16:29:35.127	Simon	Detant
b2e56e76-baae-4071-870e-6b3ea1b7391c	JeSuisUnePoubelle	2024-08-08 20:55:17.526	Poubelle	Mail
0777228e-1faf-4d2b-b02e-26c499bec803	brgs	2024-08-10 06:24:53.829	Louis	Bourgeois 
6dca1ffd-3552-42e7-86ef-48e8b56005a4	new_user	2024-08-10 08:37:29.45	Louis	Bourgeois
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	testtttttt	2024-08-14 14:08:00.556	Louis	Bourgeois
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	Agasdef05	2024-08-14 14:17:21.034	Agathe 	Deffense
80c396c1-2f4f-499f-ae8e-ee070ba60077	Dim	2024-08-14 14:37:45.058	Dimitri 	Devos
e3652277-df40-4dd4-b630-2d15c834b061	romanev111	2024-08-14 14:42:38.88	Romane	Vuillermet
ef8b9309-11e9-495c-a4e8-04760a52cfa6	testtttrus	2024-08-14 17:39:24.764	Louis	Bourgeois
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	Test	2024-08-14 18:16:41.673	Louis	Bourgeois
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	Mimie	2024-08-14 18:37:32.129	Emilie	Bourgeois 
2ab2ba4f-3e38-43f8-ac07-a7628227e492	LeVraiLeSpire	2024-08-15 20:44:31.125	Simon	Detant
ba57109f-da67-4c77-9ce0-1833bdd00d96	Lolo 	2024-08-17 21:08:14.577	Laurent 	Bourgeois 
4e2e2516-4736-43e3-8a1c-27ab2a93b883	clementine_brgs	2024-08-17 22:21:37.044	Clémentine	Bourgeois
de6aaec9-61dd-4560-b335-da1d9e42831e	louis_demo	2024-09-01 20:06:17.364	Louis	BOURGEOIS
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	Simon.D	2024-09-06 09:39:06.539	Simon	DETANT
0a95c413-7baa-41f4-9343-b824132ce241	Vecchio	2024-09-21 22:35:16.288	Kelly	Shatto
\.


--
-- Data for Name: user_profile_image; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_profile_image (user_email, image_url) FROM stdin;
bourgeois.louis.59240@gmail.com	https://firebasestorage.googleapis.com/v0/b/todoly-430912.appspot.com/o/profile_pictures%2Fbourgeois.louis.59240%40gmail.com%2F1739288610779_profile_pictures_1728677391683_Toi%20face%20%C3%83%C2%A0%20un%20exo%20de%20physique.jpg?alt=media&token=67357166-c6f7-4197-bcb0-bf5e94a64768
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_role (role_id, role_name) FROM stdin;
\.


--
-- Data for Name: user_role_assignment; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_role_assignment (user_id, role_id) FROM stdin;
\.


--
-- Data for Name: user_security; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_security (id, password_hash) FROM stdin;
0ee28fa5-0cf9-470a-b388-7bc11733437d	$2b$12$tjQc9PoG2BAOrDPBsbdKkuKBwcFubO5g7OPR4WmZnGlxQCHdB8UIa
4e541607-308c-462c-9f22-2d72d9bb9a41	$2b$12$4bzb5iZO5v/WqG11Bv3hou/PsDJ7ErKdUBEk6fBL27vi0CzcD7wYa
fc781112-083d-4896-b50e-83ef92ef3376	$2b$12$0mwOsxVp.AYU3w/3EJqrVuBedqhB/towNoaurmOZmJqIsgOKn2U0C
ca753117-7d4a-4768-b1d1-3a9a6180b152	$2b$12$OdxDWdMBBfe1S7LmpU0H1eDTBzVeWrGS0lraH9XYP3xXpgWvRbjhq
23aaff7d-47d0-4128-87d3-46c2def1e7b7	$2b$12$q40jvLRY9.DDEUwZZA70W.S6TIE5HdkjDjUcsKH9yaWq76Ue7qu4a
166eb602-2281-4fc4-a51d-87f7a45fcd30	$2b$12$9G8s0v.dLNmY/yXKuzR3uOiDVEassTMTG3tCI.RBvq/yK/6R8pudK
b2e56e76-baae-4071-870e-6b3ea1b7391c	$2b$12$MVa8/LSqYZUrSB/ujLZigu0MKlvvqmt3UcGHpr0ajiVKfbiZPuIyO
0777228e-1faf-4d2b-b02e-26c499bec803	$2b$12$a.zyB3FFIr/QBKkMVZyzsOgxMmksqGnaKVJ1rPzKv66kTrOobMvja
6dca1ffd-3552-42e7-86ef-48e8b56005a4	$2b$12$bMNmlL0gYXNHc1i5Tbmz4e85eEjVPtsVqBGgadWkPer2/AONIws1i
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	$2b$12$XpLF0f7IuHxIhuLOnnjaruFs//2nO9MuyZjqKWlhp4Q16R3x7zyT6
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	$2b$12$3oj7KjnuP4GrSjOruusJPuKjv3pt3vnofJwWk1x4olOnSZto/xGIu
80c396c1-2f4f-499f-ae8e-ee070ba60077	$2b$12$Yo7CyMVYpP7MR5Nz7MKGtOnR0GRQU3DWjvttMcPbEiNISyrBmytaG
e3652277-df40-4dd4-b630-2d15c834b061	$2b$12$drCVsKj95c1mR01hK4rd6..X/VFHvPFbAJbgLse8xsh8SBBEfSc22
ef8b9309-11e9-495c-a4e8-04760a52cfa6	$2b$12$FLSeKT2W44nosOVYlPQdPOo9VmHMxuvF1JEuacftfrLD3eA1ICq8m
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	$2b$12$OP2wH.UIdKpDq43C.ZKFTOAOEFnvp0pCFn240qW8AHBQZ9D18NHJy
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	$2b$12$qR0se5YzbJBA0/0i8ZqFNu0aCUhtmojJvIlVvFSq7hVKkGoe2btHC
2ab2ba4f-3e38-43f8-ac07-a7628227e492	$2b$12$FrPd2vVhEQKZCP98AwUsvuMnvvYUFxFm0e6WyxThm1gk5.xRf9fhu
ba57109f-da67-4c77-9ce0-1833bdd00d96	$2b$12$WBTYY966MBg0ukbom1I1kuzK5zGAXVnGhlbAg9eASwp/Ba.TSsd1i
4e2e2516-4736-43e3-8a1c-27ab2a93b883	$2b$12$F2di8UnFlwUJml6ONhuqh.xpgfdieh8jPadfUHEALAcqlvoEXHy.6
de6aaec9-61dd-4560-b335-da1d9e42831e	$2b$12$JcuUDL2FghlhAnb1RmUbzOc2DcFB0Zmp1Ucw5tGdxu6UsWPEwJQhe
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	$2b$12$pqjr90mdstCNyOCZkWgu7.yWioOjHvntnEqf/xUI5oNYP4Hl/BFpu
0a95c413-7baa-41f4-9343-b824132ce241	$2b$12$Lt5TlQFPkWBmCtVJFN6cxeQxNRZ5oh0Yycwnogp9OUZBcyuQ22xeq
\.


--
-- Data for Name: user_subscription; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_subscription (user_id, subscription_details) FROM stdin;
\.


--
-- Data for Name: user_workspaces; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.user_workspaces (user_id, workspace_id) FROM stdin;
4e541607-308c-462c-9f22-2d72d9bb9a41	630cd7c2-c11a-48ec-8ff9-fd93f7a357b9
fc781112-083d-4896-b50e-83ef92ef3376	0144354b-c9c4-4400-9400-09da6ebf4de1
ca753117-7d4a-4768-b1d1-3a9a6180b152	8058efea-6097-4a9d-80be-1375961efcc0
23aaff7d-47d0-4128-87d3-46c2def1e7b7	02eceab9-bb1d-42f7-bfe9-2f357c53584c
166eb602-2281-4fc4-a51d-87f7a45fcd30	5e4b3da6-884e-406b-b5c5-54318bbd1815
166eb602-2281-4fc4-a51d-87f7a45fcd30	53c67434-9802-44d7-9f0d-c9e7ecd5ea59
b2e56e76-baae-4071-870e-6b3ea1b7391c	d6aaaaaf-8e75-4b4d-b5c7-4980a0867037
0777228e-1faf-4d2b-b02e-26c499bec803	7a338d96-8449-40b3-9303-fe66300ceabd
6dca1ffd-3552-42e7-86ef-48e8b56005a4	acf591a0-e221-4341-99a2-e67579bae641
76773eeb-af47-4329-bbf5-0c6e7e3ab57e	c152c05a-5297-4d40-84c0-6c870fa594f4
2c7c3a2b-e99b-4aa2-9547-435ace035e4e	a02cd479-4a7b-4405-95bd-56513d447738
80c396c1-2f4f-499f-ae8e-ee070ba60077	bed66db1-1c6c-4915-a19b-560f99f249bb
e3652277-df40-4dd4-b630-2d15c834b061	78e740ff-49fd-4da9-a748-22f46ba94d48
ef8b9309-11e9-495c-a4e8-04760a52cfa6	fc8e28d5-5e68-4c6f-b98d-6b8fa172969f
9186cd4f-5ecb-482f-9fe5-41f45ec9bcda	f16dcb58-e41f-4c53-9020-816707224284
f96a3d3f-7430-466d-b9c6-0d8e5ed0314b	f158b802-8254-49f8-8261-38e839aff1c3
2ab2ba4f-3e38-43f8-ac07-a7628227e492	901df2c0-8884-4ba9-9fd1-ea9a832e55ea
ba57109f-da67-4c77-9ce0-1833bdd00d96	08f03b59-214d-44ac-b860-7ce83cda1178
4e2e2516-4736-43e3-8a1c-27ab2a93b883	dc90166f-de76-45a7-9dc5-8db4d542a100
de6aaec9-61dd-4560-b335-da1d9e42831e	31e42b12-1cc9-463c-9928-91bb48215640
a0e3efa0-cea8-4160-91d7-07e14ebeeb22	2787de3c-4f51-4364-9a44-44a83e52de5b
0a95c413-7baa-41f4-9343-b824132ce241	618d02cb-1fd9-4231-9782-50ef9f85729e
\.


--
-- Data for Name: workspace; Type: TABLE DATA; Schema: public; Owner: todoly_app_user
--

COPY public.workspace (id, name) FROM stdin;
630cd7c2-c11a-48ec-8ff9-fd93f7a357b9	Personal
0144354b-c9c4-4400-9400-09da6ebf4de1	Personal
8058efea-6097-4a9d-80be-1375961efcc0	Personal
02eceab9-bb1d-42f7-bfe9-2f357c53584c	Personal
5e4b3da6-884e-406b-b5c5-54318bbd1815	Personal
53c67434-9802-44d7-9f0d-c9e7ecd5ea59	projet avec loup
d6aaaaaf-8e75-4b4d-b5c7-4980a0867037	Personal
7a338d96-8449-40b3-9303-fe66300ceabd	Personal
acf591a0-e221-4341-99a2-e67579bae641	Personal
c152c05a-5297-4d40-84c0-6c870fa594f4	Personal
a02cd479-4a7b-4405-95bd-56513d447738	Personal
bed66db1-1c6c-4915-a19b-560f99f249bb	Personal
78e740ff-49fd-4da9-a748-22f46ba94d48	Personal
fc8e28d5-5e68-4c6f-b98d-6b8fa172969f	Personal
f16dcb58-e41f-4c53-9020-816707224284	Personal
f158b802-8254-49f8-8261-38e839aff1c3	Personal
901df2c0-8884-4ba9-9fd1-ea9a832e55ea	Personal
08f03b59-214d-44ac-b860-7ce83cda1178	Personal
dc90166f-de76-45a7-9dc5-8db4d542a100	Personal
31e42b12-1cc9-463c-9928-91bb48215640	Personal
2787de3c-4f51-4364-9a44-44a83e52de5b	Personal
618d02cb-1fd9-4231-9782-50ef9f85729e	Personal
6a87010a-4bf7-44e1-a0cc-9070c5cadb77	School & learning
cd13a3f2-3826-4fd6-8d1c-1e8e34a498a7	Personal
\.


--
-- Name: user_role_assignments_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todoly_app_user
--

SELECT pg_catalog.setval('public.user_role_assignments_role_id_seq', 1, false);


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todoly_app_user
--

SELECT pg_catalog.setval('public.user_roles_role_id_seq', 1, false);


--
-- Name: task_workspaces pk_task_workspace; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_workspaces
    ADD CONSTRAINT pk_task_workspace PRIMARY KEY (task_id, workspace_id);


--
-- Name: user_preferences pk_user_preferences; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT pk_user_preferences PRIMARY KEY (user_id, preference_key);


--
-- Name: section sections_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: tag tag_name_key; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_name_key UNIQUE (name);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: task tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: task_properties tasks_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_properties
    ADD CONSTRAINT tasks_properties_pkey PRIMARY KEY (task_id);


--
-- Name: task_properties tasks_properties_title_key; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_properties
    ADD CONSTRAINT tasks_properties_title_key UNIQUE (title);


--
-- Name: user_role_assignment user_assignments_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role_assignment
    ADD CONSTRAINT user_assignments_user_id_unique UNIQUE (user_id);


--
-- Name: user_contact user_contact_email_unique; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_contact
    ADD CONSTRAINT user_contact_email_unique UNIQUE (email);


--
-- Name: user_contact user_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_contact
    ADD CONSTRAINT user_contact_pkey PRIMARY KEY (user_id);


--
-- Name: user_contact user_contact_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_contact
    ADD CONSTRAINT user_contact_user_id_unique UNIQUE (user_id);


--
-- Name: user_profile_image user_profile_image_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_profile_image
    ADD CONSTRAINT user_profile_image_pkey PRIMARY KEY (user_email);


--
-- Name: user_role_assignment user_role_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role_assignment
    ADD CONSTRAINT user_role_assignments_pkey PRIMARY KEY (user_id);


--
-- Name: user_role user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role_id);


--
-- Name: user_role user_roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_roles_role_name_key UNIQUE (role_name);


--
-- Name: user_security user_security_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_security
    ADD CONSTRAINT user_security_pkey PRIMARY KEY (id);


--
-- Name: user_subscription user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_subscription
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (user_id);


--
-- Name: user_workspaces user_workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_workspaces
    ADD CONSTRAINT user_workspaces_pkey PRIMARY KEY (user_id, workspace_id);


--
-- Name: user_profile username_unique; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT username_unique UNIQUE (username);


--
-- Name: user_profile users_id_unique; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT users_id_unique UNIQUE (id);


--
-- Name: user_profile users_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workspace workspace_pkey; Type: CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.workspace
    ADD CONSTRAINT workspace_pkey PRIMARY KEY (id);


--
-- Name: idx_user_contact_email; Type: INDEX; Schema: public; Owner: todoly_app_user
--

CREATE INDEX idx_user_contact_email ON public.user_contact USING btree (email);


--
-- Name: idx_user_profile_username; Type: INDEX; Schema: public; Owner: todoly_app_user
--

CREATE INDEX idx_user_profile_username ON public.user_profile USING btree (username);


--
-- Name: task fk_linked_section; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT fk_linked_section FOREIGN KEY (linked_section) REFERENCES public.section(id) ON DELETE CASCADE;


--
-- Name: section fk_user; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.user_profile(id) ON DELETE CASCADE;


--
-- Name: tag fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: task_properties task_properties_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_properties
    ADD CONSTRAINT task_properties_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: task_workspaces task_workspaces_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_workspaces
    ADD CONSTRAINT task_workspaces_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.task(id) ON DELETE CASCADE;


--
-- Name: task_workspaces task_workspaces_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_workspaces
    ADD CONSTRAINT task_workspaces_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspace(id) ON DELETE CASCADE;


--
-- Name: task_properties tasks_properties_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task_properties
    ADD CONSTRAINT tasks_properties_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.task(id);


--
-- Name: task tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: user_contact user_contact_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_contact
    ADD CONSTRAINT user_contact_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: user_role_assignment user_role_assignments_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role_assignment
    ADD CONSTRAINT user_role_assignments_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_role(role_id);


--
-- Name: user_role_assignment user_role_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_role_assignment
    ADD CONSTRAINT user_role_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: user_security user_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_security
    ADD CONSTRAINT user_security_id_fkey FOREIGN KEY (id) REFERENCES public.user_profile(id);


--
-- Name: user_subscription user_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_subscription
    ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id);


--
-- Name: user_workspaces user_workspaces_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_workspaces
    ADD CONSTRAINT user_workspaces_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id) ON DELETE CASCADE;


--
-- Name: user_workspaces user_workspaces_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todoly_app_user
--

ALTER TABLE ONLY public.user_workspaces
    ADD CONSTRAINT user_workspaces_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspace(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

