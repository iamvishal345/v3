import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Head as Meta } from '@components';
import { IconBookmark } from '@components/icons';
import { Link } from 'gatsby';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;

    a {
      &:hover,
      &:focus {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>")
            20 0,
          auto;
      }
    }
  }

  footer {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-top: 20px;
    gap: 1rem;
  }
`;
const StyledGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 15px;
  margin-top: 50px;
  position: relative;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;
const StyledPost = styled.li`
  transition: var(--transition);
  cursor: default;

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .post__inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .post__inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    transition: var(--transition);
    background-color: var(--secondary-bg);

    header,
    a {
      width: 100%;
    }
  }

  .post__icon {
    ${({ theme }) => theme.mixins.flexBetween};
    color: var(--secondary-color);
    margin-bottom: 30px;
    margin-left: -5px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .post__title {
    margin: 0 0 10px;
    color: var(--tertiary-text);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .post__desc {
    color: var(--secondary-text);
    font-size: 17px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
  }

  .post__date {
    color: var(--secondary-text);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-transform: uppercase;
  }

  ul.post__tags {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      color: var(--secondary-color);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 8px;
      }
    }
  }
`;

const PostPage = ({ location }) => {
  const [posts, setPosts] = useState(window?.posts || []);

  useEffect(() => {
    (async () => {
      if (window.posts) {
        return;
      }
      const res = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.codeentity.tech%2Frss.xml&api_key=wubgt93t4jusc8cybmydvm2d6ccqoqv2yzosrrvz&order_by=pubDate&count=30',
      );
      const data = await res.json();
      window.posts = data.items;
      setPosts(data.items);
    })();
  }, []);

  return (
    <Layout location={location}>
      <StyledMainContainer>
        <Link className="tags-link" to="/posts/tags">
          All tags
        </Link>
        <header>
          <h1 className="big-heading">Posts</h1>
          <p className="subtitle">
            <a href="https://www.wizardingworld.com/writing-by-jk-rowling/pensieve">
              a collection of memories
            </a>
          </p>
        </header>
        <StyledGrid>
          {posts.length > 0 &&
            posts.map((post, i) => {
              const { title, description, link, pubDate, categories } = post;
              const formattedDate = new Date(pubDate).toLocaleDateString('en-IN');

              return (
                <StyledPost key={i}>
                  <div className="post__inner">
                    <header>
                      <div className="post__icon">
                        <IconBookmark />
                      </div>
                      <h5 className="post__title">
                        <a href={link} target="_blank" rel="noreferrer">
                          {title}
                        </a>
                      </h5>
                      <p className="post__desc">{description}</p>
                    </header>

                    <footer>
                      <span className="post__date">{formattedDate}</span>
                      <ul className="post__tags">
                        {categories.map((tag, i) => (
                          <li key={i}>
                            <p className="inline-link">#{tag}</p>
                          </li>
                        ))}
                      </ul>
                    </footer>
                  </div>
                </StyledPost>
              );
            })}
        </StyledGrid>
      </StyledMainContainer>
    </Layout>
  );
};

export function Head() {
  return <Meta title="Posts" />;
}

PostPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default PostPage;
