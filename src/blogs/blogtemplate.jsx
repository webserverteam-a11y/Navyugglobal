import { useLayoutEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import BlogCards from "../components/blogcards";
import Loader from "../components/loader";

import useFetch from "../services/useFetch";

import {
  getBlogDetails,
  getBlogsData,
} from "../services/api";

import FallbackImage from "../assets/blogtemp.png";
import { Helmet } from "react-helmet-async";

gsap.registerPlugin(ScrollTrigger);

function BlogTemplate() {

  const { slug } = useParams();

  const mainRef = useRef(null);

  /* =========================================
     SINGLE BLOG
  ========================================= */
  const {
    data: blogData,
    loading: blogLoading,
    error: blogError,
  } = useFetch(() => getBlogDetails(slug));

  /* =========================================
     ALL BLOGS
  ========================================= */
  const {
    data: blogsData,
    loading: blogsLoading,
    error: blogsError,
  } = useFetch(getBlogsData);

  const loading = blogLoading || blogsLoading;

  const error = blogError || blogsError;

  /* =========================================
     RECENT POSTS
  ========================================= */
  const recentPosts = useMemo(() => {

    if (!blogsData || !Array.isArray(blogsData)) {
      return [];
    }

    return blogsData
      .filter((blog) => blog.slug !== slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

  }, [blogsData, slug]);

  /* =========================================
     GSAP
  ========================================= */
  useLayoutEffect(() => {

    if (loading || error || !mainRef.current) return;

    const ctx = gsap.context(() => {

      /* HERO */
      const heroTl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTl
        .from(".companiesHero", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(
          ".companiesHero .content h1",
          {
            y: 70,
            opacity: 0,
            duration: 1.1,
          },
          "-=1"
        )
        .from(
          ".companiesHero .content p",
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.75"
        )
        .from(
          ".companiesHero .content .btn",
          {
            y: 28,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.6"
        );

      /* CONTENT */
      gsap.from(".blogContent .featuredImage", {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".blogContent",
          start: "top 80%",
        },
      });

      gsap.from(".blogContent .dynamicContent > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".dynamicContent",
          start: "top 80%",
        },
      });

      /* RECENT POSTS */
      gsap.from(".fullblogs .normalCard", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fullblogs",
          start: "top 85%",
        },
      });

    }, mainRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };

  }, [loading, error]);

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return <Loader />;
  }

  /* =========================================
     ERROR
  ========================================= */
  if (error) {
    return <div>{error}</div>;
  }

  /* =========================================
     BLOG DATA
  ========================================= */
  const hero = blogData?.hero_section;

  return (
    <>
      <Helmet>
        <title>{blogData?.seo?.meta_title}</title>
        <meta name="description" content={blogData?.seo?.meta_description}></meta>
      </Helmet>

      <main className="blogTemplate" ref={mainRef}>

        {/* =========================================
          HERO
      ========================================= */}
        <section
          className="commonHero companiesHero"

        >
          <div className="content">

            <h1>
              {hero?.title || blogData?.title}
            </h1>

            <p>
              {blogData?.date}
            </p>

            <a
              className="btn btn4"
              href="#content"
              onClick={(e) => {

                e.preventDefault();

                window.lenis?.scrollTo("#content", {
                  duration: 1.4,
                });

              }}
            >
              Read More

              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6464 5.64648C11.8417 5.45121 12.1582 5.45121 12.3535 5.64648C12.5487 5.84174 12.5487 6.15825 12.3535 6.35351L8.35348 10.3535C8.15822 10.5488 7.84171 10.5488 7.64645 10.3535L3.64645 6.35351C3.45118 6.15825 3.45118 5.84174 3.64645 5.64648C3.84171 5.45121 4.15822 5.45121 4.35348 5.64648L7.99996 9.29296L11.6464 5.64648Z"
                  fill="white"
                />
              </svg>

            </a>

          </div>
        </section>

        {/* =========================================
          BLOG CONTENT
      ========================================= */}
        <section className="blogContent" id="content">

          <img
            className="featuredImage"
            src={hero?.image?.url || FallbackImage}
            alt={hero?.image?.alt || "Blog"}
          />

          <div
            className="dynamicContent"
            dangerouslySetInnerHTML={{
              __html: hero?.description || "<p>No content found.</p>",
            }}
          />

        </section>

        {/* =========================================
          RECENT POSTS
      ========================================= */}
        <section className="fullblogs" id="blogs">

          <div>
            <h2>Recent Posts</h2>
          </div>

          <div className="allCards">

            {recentPosts.map((blog) => (

              <BlogCards
                key={blog.id}
                className="normalCard"
                title={
                  blog.hero_section?.title ||
                  blog.title
                }
                banner={
                  blog.hero_section?.image?.url ||
                  FallbackImage
                }
                description={
                  (() => {
                    const text = (blog.hero_section?.description || "")
                      .replace(/<[^>]*>/g, "") // remove HTML tags
                      .replace(/&nbsp;/g, " ")
                      .trim();

                    return (
                      <p
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {text}
                      </p>
                    );
                  })()
                }
                tag={
                  blog.hero_section?.tags?.[0]?.tags ||
                  ""
                }
                date={blog.date}
                link={`/blogs/${blog.slug}`}
              />

            ))}

          </div>

        </section>

      </main>
    </>
  );
}

export default BlogTemplate;