const Button = ({ className, onClick, type, text, style }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      className={`text-white rounded-full ${className}`} // REMOVE z-50 from here
    >
      {text}
    </button>
  );
};

export default Button;
