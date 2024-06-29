interface MessageBoxProps {
  background: string
  text: string
  align?: "left" | "right"
}

const MessageBox: React.FC<MessageBoxProps> = ({
  background,
  text,
  align = "left"
}) => {
  const alignmentClass = align === "right" ? "ml-auto" : "mr-auto"

  return (
    <p
      className={`p-4 rounded-xl text-2xl text-plasmo-gray-dark max-w-2xl ${background} ${alignmentClass}`}>
      {text}
    </p>
  )
}

export default MessageBox
