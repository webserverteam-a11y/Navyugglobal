import { useEffect, useState } from "react";

export default function useFetch(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const result = await apiFunction();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError("Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiFunction]);

  return { data, loading, error };
}