interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  console.log("VerifyEmailPage  token:", token);
  return (
    <div className="container relative flex pt-20 flex-col item-center justify-center lg:px-0">
      <div className="mx-auto flex w-full justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
