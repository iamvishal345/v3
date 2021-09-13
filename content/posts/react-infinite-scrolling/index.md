---
title: Infinite scrolling in React
description: Infinite scrolling implemented using IntersectionObserver in React
date: 2021-03-21
draft: false
slug: /pensieve/clickable-cards
tags:
  - React
  - IntersectionObserver
---

[Demo](https://iamvishal345.github.io/frontend-task-college/)

Infinite scrolling in react functional component using `IntersectionObserver` and Loading component reference.

## JAVASCRIPT

```js:title=App.jsx
import { useState, useEffect, useRef } from 'react';
import './App.scss';
import CollegeCard from './components/college-card/college-card';
import { Loader } from './components/presentational/loader/loader';
import { getCollegeList } from './services/get-college-list';

function App() {
  const loadingRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(-1);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
  }, []);
  const handleObserver = entities => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage(page => page + 1);
    }
  };
  useEffect(() => {
    (async () => {
      if (page > -1) {
        setIsLoading(true);
        const collegeList = await getCollegeList(page);
        if (collegeList.length === 0) {
          setIsLoading(false);
        } else {
          setColleges(c => [...c, ...collegeList]);
        }
      }
    })();
  }, [page]);
  return (
    <div className="container">
      <h2>Colleges in North India</h2>
      <div className="cards">
        {Array.isArray(colleges) &&
          colleges.map((college, i) => <CollegeCard key={i} college={college} />)}
      </div>
      {
        <div ref={loadingRef} style={{ display: isLoading ? 'block' : 'none' }}>
          <Loader />
        </div>
      }
    </div>
  );
}

export default App;
```
