import NewForm from "./NewForm";

export const metadata = {
  title: "Post a listing",
  description: "List your guest post site, request guest posts or offer writing services . Free.",
};

export default function NewPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Post a listing</h1>
      <p className="mt-2 text-stone-600">Free. We review each post before it goes live, usually within a day.</p>
      <NewForm />
    </div>
  );
}
