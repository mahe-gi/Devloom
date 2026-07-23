import { Link } from "react-router";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

function BlogCard({
  id,
  authorName,
  title,
  content,
  // publishedDate,
}: BlogCardProps) {
  return (
    <Link to={`/blog/${id}`}>
      <div className=" border-b-2 border-slate-100  p-4">
        <div className=" flex gap-x-1">
          <div className="flex items-center justify-center">
            <Avatar authorName={authorName} />
          </div>
          <div className=" flex  capitalize items-center">
            <div className=" pl-1 text-sm font-light">{authorName} </div>
          </div>
          {/* <div>{publishedDate}</div> */}
        </div>

        <div className="  text-gray-800 text-2xl font-bold  capitalize pt-2">{title}</div>
        <div className="font-light text-[#6b6b6b] overflow-hidden text-ellipsis break-words ">
          {content.length > 200
            ? content.slice(0, 200) + "..."
            : content.slice(0, 200)}
        </div>
        <div className=" font-thin text-sm pt-4">{`${Math.ceil(
          content.length / 100
        )} mins read`}</div>
      </div>
    </Link>
  );
}

export default BlogCard;



export function Avatar({
  authorName,
  size,
}: {
  authorName: string;
  size?: number;
}) {
  return (
    <div>
      <div
        className="relative inline-flex items-center justify-center w-5 h-5 overflow-hidden bg-sky-300  rounded-full"
        style={{ width: size, height: size }}
      >
        <span className="font-medium text-gray-600 dark:text-gray-300  capitalize">
          {authorName[0]}
        </span>
      </div>
    </div>
  );
}

export function Circle() {
  return <div className=" h-1 w-1 rounded-full bg-slate-500"></div>;
}
