export default function SliderButtonRight(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        border: "1px solid rgba(172, 184, 205, 1)",
        backgroundColor: "#a3a3a3",
        padding: 10,
        right: -70,
      }}
      onClick={onClick}
    />
  );
}
