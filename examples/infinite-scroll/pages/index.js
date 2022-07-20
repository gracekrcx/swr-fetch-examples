import useSWRInfinite from "swr/infinite";
import { useState, useRef, useEffect } from "react";
import fetcher from "../libs/fetch";
import useOnScreen from "../hooks/useOnScreen";

const PAGE_SIZE = 8;

const getKey = (pageIndex, previousPageData, repo, pageSize) => {
  console.log({ pageIndex, previousPageData, repo, pageSize });
  if (previousPageData && !previousPageData.length) return null;
  return `https://api.github.com/repos/${repo}/issues?per_page=${pageSize}&page=${
    pageIndex + 1
  }`;
};

export default function App() {
  const ref = useRef();

  // input state
  const [repo, setRepo] = useState("facebook/react");
  const [val, setVal] = useState(repo);

  // observer
  const isVisible = useOnScreen(ref);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => {
      // console.log("---> args:::", args);
      // args = [0, null]
      return getKey(...args, repo, PAGE_SIZE);
    },
    fetcher
  );

  console.log({ data, error, mutate, size, setSize, isValidating });

  const issues = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;

  // ? typeof data[size - 1]);
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  // ? data?.[0]?.length === 0
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = size === PAGE_SIZE;

  // ? data.length === size
  const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    // isVisible 改變
    // isRefreshing 改變
    // 判斷是否 fetch (size + 1)
    if (isVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1);
    }
  }, [isVisible, isRefreshing]);

  return (
    <div style={{ margin: "40px", width: "auto" }}>
      <input
        value={val}
        type="text"
        onChange={(e) => setVal(e.target.val)}
        placeholder="search"
      />
      <button
        onClick={() => {
          setRepo(val);
          setSize(size + 1);
        }}
      >
        Get Lists
      </button>
      <p>
        showing {size} page(s) of {isLoadingMore ? "loading..." : issues.length}
      </p>

      {/* button content : refreshing and clear */}
      <div>
        <button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? "refreshing..." : "refresh"}
        </button>
        <button disabled={!size} onClick={() => setSize(0)}>
          clear
        </button>
      </div>

      {/* list content */}
      {isEmpty ? <p>Yay, no issues found.</p> : null}
      {issues.map((issue) => {
        return (
          <p key={issue.id} style={{ margin: "6px 0", height: 50 }}>
            - {issue.title}
          </p>
        );
      })}

      {/* ref */}
      <div ref={ref}>
        {isLoadingMore ? "loading..." : isReachingEnd ? "no more issues" : ""}
      </div>
    </div>
  );
}
