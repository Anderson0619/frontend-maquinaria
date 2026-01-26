import Image from "next/image";

interface ILeftImagePublic {
  backgroundImage: string;
  label: string;
  className?: string;
}

const LeftImagePublic = (props: ILeftImagePublic) => {
  const { backgroundImage, label } = props;
  return (
    <div
      {...props}
      className="animate__animated animate__fadeIn flex flex-col h-full justify-end p-12"
    >
      <h2 className="text-2xl md:text-3xl lg:text-5xl text-white z-50 font-bold w-1/2">
        {label}
      </h2>
      <Image
        src={backgroundImage}
        layout="fill"
        objectFit="cover"
        alt="background"
      />
    </div>
  );
};

export default LeftImagePublic;
