interface BlogCardProps {
  title: string;
  content: string;
}

export function BlogsCardLeft({ blog }: { blog: BlogCardProps }) {
  return (
    <div className=" h-full col-span-8 px-6 ">
      <div>
        <h2 className=" text-3xl lg:text-4xl font-medium capitalize">
          {blog.title}
        </h2>
      </div>
      <div>
        <p className=" text-sm lg:text-sm text-gray-500 capitalize pt-4">
          {/*Author name */}
          bg Author
        </p>
      </div>
      <div>
        <p className=" text-sm lg:text-sm text-gray-500 capitalize pt-4">
          {/* posted on date */}
          posted on Augest 24 , 2024
        </p>
      </div>
      <div className=" text-[17px] indent-8 text-[#6b6b6b] font-light pt-4 overflow-hidden text-justify text-ellipsis break-words">
        {/* content here  */}
        {blog?.content}
      </div>
    </div>
  );
}
