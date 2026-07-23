export function ToggleCard() {


  function handlelogout() {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  }
  return (
   <div className=" absolute right-4 bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
      </li>
      <li onClick={handlelogout}>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logout</a>
      </li>
    </ul>
</div>

  );
}
