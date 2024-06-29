interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: string
  buttonText?: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  icon,
  buttonText = "Submit"
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-2 items-center rounded-lg text-2xl font-semibold px-4 py-2 ${className}`}
      disabled={disabled}>
      {icon && <img src={icon} alt="button icon" className="h-6 w-6" />}
      <span>{buttonText}</span>
    </button>
  )
}

export default Button
