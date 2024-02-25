interface FormHeadingProps {
  title: string;
  description: string;
}

export default function FormHeading({ title, description }: FormHeadingProps) {
  return (
    <div>
      <h1 className="text-2xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
