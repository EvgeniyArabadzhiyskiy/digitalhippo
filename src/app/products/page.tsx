import SomeComponent from "@/components/UserAccountNav";

const getPost = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  const data = await res.json();
  console.log("getPost  data:", data);

  return data;
};

const Page = async () => {
  const posts = await getPost();
  return (
    <>
      <h1>Products Page</h1>
      {posts.title}
      <SomeComponent />
    </>
  );
};

export default Page;
