import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="flex items-center border dark:border-gray-600 dark:bg-gray-700 rounded-lg px-3 py-2 mb-3">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Contraseña"}
        className="w-full bg-transparent text-sm outline-none dark:text-gray-100 dark:placeholder-gray-400"
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="text-blue-600 cursor-pointer"
          onClick={() => setIsShowPassword(false)}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          className="text-gray-400 cursor-pointer"
          onClick={() => setIsShowPassword(true)}
        />
      )}
    </div>
  );
};

export default PasswordInput;