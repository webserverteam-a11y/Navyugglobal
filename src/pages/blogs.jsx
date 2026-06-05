import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import BlogCards from "../components/blogcards";
import Loader from "../components/loader";

import useFetch from "../services/useFetch";
import { getMediaPageData, getBlogsData } from "../services/api";

import FallbackImage from "../assets/blogtemp.png";
import { Helmet } from "react-helmet-async";

gsap.registerPlugin(ScrollTrigger);

function Blogs() {
  const mainRef = useRef(null);

  const [showLoader, setShowLoader] = useState(true);

  // ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState("All");

  /* =========================================
     FETCH DATA
  ========================================= */
  const {
    data: mediaData,
    loading: mediaLoading,
    error: mediaError,
  } = useFetch(getMediaPageData);

  const {
    data: blogsData,
    loading: blogsLoading,
    error: blogsError,
  } = useFetch(getBlogsData);

  const loading = mediaLoading || blogsLoading;
  const error = mediaError || blogsError;

  /* =========================================
     SORT BLOGS (LATEST FIRST)
  ========================================= */
  const sortedBlogs = useMemo(() => {
    if (!blogsData || !Array.isArray(blogsData)) return [];

    return [...blogsData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [blogsData]);

  /* =========================================
     FEATURED BLOG
     (NOT FILTERED)
  ========================================= */
  const featuredBlog = sortedBlogs[0];

  /* =========================================
     REMAINING BLOGS
  ========================================= */
  const remainingBlogs = sortedBlogs.slice(1);

  /* =========================================
     UNIQUE FILTER TAGS
  ========================================= */
  const filterTags = useMemo(() => {
    const uniqueTags = [];

    remainingBlogs.forEach((blog) => {
      if (blog.hero_section?.tags?.length) {
        blog.hero_section.tags.forEach((item) => {
          if (
            item?.tags &&
            !uniqueTags.includes(item.tags)
          ) {
            uniqueTags.push(item.tags);
          }
        });
      }
    });

    return ["All", ...uniqueTags];
  }, [remainingBlogs]);

  /* =========================================
     FILTER ONLY REMAINING BLOGS
  ========================================= */
  const filteredRemainingBlogs = useMemo(() => {
    if (activeFilter === "All") {
      return remainingBlogs;
    }

    return remainingBlogs.filter((blog) =>
      blog.hero_section?.tags?.some(
        (item) => item.tags === activeFilter
      )
    );
  }, [remainingBlogs, activeFilter]);

  /* =========================================
     GSAP ANIMATIONS
  ========================================= */
  useEffect(() => {
    if (loading || error || !mainRef.current) return;

    const ctx = gsap.context(() => {

      /* LOADER */
      gsap.to(".loader", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          setShowLoader(false);
        },
      });

      /* HERO */
      const heroTl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTl
        .from(".blogsHero", {
          scale: 1.08,
          opacity: 0,
          duration: 1.5,
        })
        .from(
          ".blogsHero .content h1",
          {
            y: 70,
            opacity: 0,
            duration: 1,
          },
          "-=1"
        )
        .from(
          ".blogsHero .content p",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.7"
        );

      /* HEADING */
      gsap.from(".fullblogs .heading h2", {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".fullblogs",
          start: "top 85%",
        },
      });

      /* FEATURED */
      gsap.from(".fullblogs .featured", {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".fullblogs .featured",
          start: "top 85%",
        },
      });

      /* NORMAL CARDS */
      gsap.from(".fullblogs .normalCard", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fullblogs .allCards",
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
     LOADER FALLBACK
  ========================================= */
  useEffect(() => {
    if (!loading) {

      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  /* =========================================
     ERROR
  ========================================= */
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{mediaData?.seo?.meta_title}</title>
        <meta name="description" content={mediaData?.seo?.meta_description}></meta>
      </Helmet>
      {showLoader && <Loader />}

      <main className="blogs" ref={mainRef}>

        {/* =========================================
            PAGE CSS
        ========================================= */}
        <style>
          {`
            .blogFilterWrap{
              display:flex;
              flex-wrap:wrap;
              gap:12px;
              margin:30px 0 40px;
            }

            .blogFilterItem{
              padding:10px 18px;
              border:1px solid #d9d9d9;
              border-radius:100px;
              cursor:pointer;
              font-size:14px;
              font-weight:500;
              transition:all 0.3s ease;
              user-select:none;
            }

            .blogFilterItem:hover{
              background:#000;
              color:#fff;
              border-color:#000;
            }

            .blogFilterActive{
              background:#000;
              color:#fff;
              border-color:#000;
            }
          `}
        </style>

        {/* =========================================
            HERO SECTION
        ========================================= */}
        <section
          className="commonHero blogsHero">
          <div
            className="content"
            style={{
              backgroundImage: mediaData?.hero_section?.background?.url
                ? `url(${mediaData.hero_section.background.url})`
                : {},
            }}
          >

            <h1
              dangerouslySetInnerHTML={{
                __html:
                  mediaData?.hero_section?.title ||
                  "Discover new insights and stay ahead of the curve",
              }}
            />

            <p
              dangerouslySetInnerHTML={{
                __html:
                  mediaData?.hero_section?.description ||
                  "Get our best insights curated for you",
              }}
            />

          </div>
        </section>

        {/* =========================================
            BLOGS SECTION
        ========================================= */}
        <section className="fullblogs" id="blogs">

          <div className="allCards">

            {/* =========================================
                FEATURED BLOG
                (NOT FILTERED)
            ========================================= */}
            {featuredBlog && (
              <BlogCards
                className="featured"
                title={
                  featuredBlog.hero_section?.title ||
                  featuredBlog.title
                }
                banner={
                  featuredBlog.hero_section?.image?.url ||
                  FallbackImage
                }
                description={
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        featuredBlog.hero_section?.description ||
                        featuredBlog.excerpt,
                    }}
                  />
                }
                tag={
                  featuredBlog.hero_section?.tags?.[0]?.tags ||
                  ""
                }
                date={featuredBlog.date}
                link={`/blogs/${featuredBlog.slug}`}
              />
            )}

            {/* =========================================
                HEADING
            ========================================= */}
            <div className="heading">
              <h2>All Media</h2>
              {/* =========================================
                FILTER TAGS
            ========================================= */}
              <div className="blogFilterWrap">
                {filterTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`blogFilterItem ${activeFilter === tag
                        ? "blogFilterActive"
                        : ""
                      }`}
                    onClick={() => setActiveFilter(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* =========================================
                FILTERED BLOGS ONLY
            ========================================= */}
            {filteredRemainingBlogs.length > 0 &&
              filteredRemainingBlogs.map((blog) => (
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
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.hero_section?.description ||
                          blog.excerpt,
                      }}
                    />
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

export default Blogs;