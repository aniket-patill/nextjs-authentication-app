interface UserProfileParams {
  params: {
    id: string;
  };
}

export default async function UserProfilePage({ params }: UserProfileParams) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-2xl">Profile page: {params.id}</p>
    </div>
  );
}
