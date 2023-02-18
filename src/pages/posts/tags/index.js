import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Head as Meta } from '@components';
import { isSSR } from '@utils';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: var(--secondary-text);

    li {
      font-size: var(--fz-xxl);

      a {
        color: var(--secondary-text);

        .count {
          color: var(--primary-text);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

const TagsPage = ({ location }) => {
  const [tags, setTags] = useState({});

  useEffect(() => {
    if (!isSSR) {
      (async () => {
        const tagsObj = {};
        if (!window.posts) {
          const res = await fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.codeentity.tech%2Frss.xml&api_key=wubgt93t4jusc8cybmydvm2d6ccqoqv2yzosrrvz&order_by=pubDate&count=30',
          );
          const data = await res.json();
          window.posts = data.items;
        }
        window.posts.forEach(post => {
          post.categories.forEach(category => {
            if (tagsObj[category]) {
              tagsObj[category] += 1;
            } else {
              tagsObj[category] = 1;
            }
          });
        });
        setTags(tagsObj);
      })();
    }
  }, []);

  return (
    <Layout location={location}>
      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/posts">All posts</Link>
        </span>

        <h1>Tags</h1>
        <ul className="fancy-list">
          {Object.entries(tags).map(([tag, count]) => (
            <li key={tag}>
              <a
                href={`https://codeentity.tech?filter=${tag}`}
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                {tag} <span className="count">({count})</span>
              </a>
            </li>
          ))}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

export function Head() {
  return <Meta title="Tags" />;
}

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
  location: PropTypes.object,
};

export default TagsPage;
