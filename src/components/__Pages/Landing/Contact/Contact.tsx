import { ICreateContactInput } from "gql/Contact/mutations";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Input, Row } from "rsuite";
import isEmail from "validator/lib/isEmail";

export const Contact = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ICreateContactInput>();

  const controllerProps = {
    control,
    rules: { required: true },
  };

  const handleCreateComment = (data) => {
    // eslint-disable-next-line no-console
    console.info("🚀 ~ data", data);
    alert("WORKS!");
  };

  return (
    <div className=" mx-auto  w-full md:w-3/4 mt-3">
      <div className="p-8 text-center">
        <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>

        <p>
          Vestibulum saggitis mollis leo et vestibulum. Curabitur auctor felis
          quis felis ullamcorper
        </p>

        <Row className="mt-6">
          <Col xs={24} md={12} className="mb-3">
            <div className="flex flex-col mr-5 w-full gap-2 ">
              <div className="text-left">
                <label className="font-bold">Nombre</label>
                <Controller
                  {...controllerProps}
                  defaultValue=""
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ingresar su nombre"
                      size="lg"
                    />
                  )}
                />
                {errors?.name && (
                  <span className="text-red-500">Debes ingresar un nombre</span>
                )}
              </div>
              <div className="text-left">
                <label className="font-bold">Ciudad</label>
                <Controller
                  {...controllerProps}
                  defaultValue=""
                  name="city"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ingresar su ciudad"
                      size="lg"
                    />
                  )}
                />
                {errors?.city && (
                  <span className="text-red-500">Debes ingresar ciudad</span>
                )}
              </div>
              <div className="text-left">
                <label className="font-bold">Email</label>
                <Controller
                  {...controllerProps}
                  defaultValue=""
                  name="email"
                  rules={{
                    required: true,
                    validate: (value) => isEmail(value),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ingresar su email"
                      size="lg"
                    />
                  )}
                />
                {errors?.email && (
                  <span className="text-red-500">Debes ingresar un email</span>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} md={12} className="text-left mb-3">
            <label className="font-bold">Comentario</label>
            <Controller
              {...controllerProps}
              name="comment"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingresa el comentario"
                  as="textarea"
                  rows={10}
                />
              )}
            />
            {errors?.comment && (
              <span className="text-red-500">Debes ingresar el comentario</span>
            )}
          </Col>
        </Row>
        <div className="flex justify-end">
          <div className="mt-3 w-full md:w-1/3 ">
            <Button
              className="px-8 py-2 mb-4"
              appearance="primary"
              block
              size="lg"
              onClick={handleSubmit(handleCreateComment)}
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
