import SomeComponent from "@/components/UserAccountNav";
import payload from "payload";

const getPost = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  const data = await res.json();
  console.log("getPost  data:", data);

  return data;
};

const Page = async () => {
  // const posts = await getPost();
  const {docs} = await payload.find({
    collection: "products"
  })
  // console.log("Page  docs:", docs[1]);
  return (
    <>
      <h1>Products Page</h1>
     Title: {docs[1].name}
      {/* <SomeComponent /> */}
    </>
  );
};

export default Page;
