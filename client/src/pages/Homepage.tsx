import { useEffect } from 'react';

const Homepage = () => {
  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch('http://localhost:3000/');
      const result = await res.json();
      console.log(result);
      return result;
    };
    fetchTest();
  }, []);

  return <div>homagePage</div>;
};

export default Homepage;
