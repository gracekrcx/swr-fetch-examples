export default async function fetcher(...args) {
  // console.log("--> fetch::", args);
  // By default, key will be passed to fetcher as the argument.
  const res = await fetch(...args);
  return res.json();
}
