const ServerComponent = async () => {
  const data = await new Promise((res, rej) => {
    res("Djon");
  }) as string
  console.log("data  data:", data);
  
  return <h1 className="text-6xl">SERVER - {data}</h1>;
};

export default ServerComponent;
