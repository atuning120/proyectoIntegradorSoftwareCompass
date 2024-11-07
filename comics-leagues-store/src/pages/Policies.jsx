import React from 'react'

const Policies = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Términos y Condiciones
      </h1>

      <p className="text-gray-700 mb-6">
        Bienvenido/a a nuestra plataforma. Estos Términos y Condiciones regulan el uso de los servicios y productos ofrecidos en nuestro sitio web de cursos de dibujo. Al acceder o utilizar nuestro sitio, aceptas estos términos en su totalidad.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        1. Aceptación de los Términos
      </h2>
      <p className="text-gray-600 mb-4">
        Al registrarte y usar nuestra plataforma, confirmas que has leído, comprendido y aceptado estos términos. Si no estás de acuerdo, debes abstenerte de utilizar nuestros servicios.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        2. Modificaciones
      </h2>
      <p className="text-gray-600 mb-4">
        Nos reservamos el derecho a modificar estos términos en cualquier momento. Se notificará a los usuarios registrados sobre cambios importantes. Es responsabilidad del usuario revisar periódicamente los términos actualizados.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        3. Uso de la Plataforma
      </h2>
      <p className="text-gray-600 mb-4">
        Los cursos disponibles en la plataforma son para uso personal y educativo. Está prohibido distribuir, revender o compartir el contenido sin autorización expresa por escrito.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        4. Pago y Acceso a los Cursos
      </h2>
      <p className="text-gray-600 mb-4">
        Los cursos comprados estarán disponibles tras la confirmación del pago. No se permite reembolsar compras digitales una vez que el usuario haya accedido al contenido del curso.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        5. Responsabilidad del Usuario
      </h2>
      <p className="text-gray-600 mb-4">
        Cada usuario es responsable de mantener la confidencialidad de su cuenta y de todas las actividades que ocurran bajo su sesión. La plataforma no será responsable por accesos no autorizados si el usuario no protege sus credenciales.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        6. Contacto
      </h2>
      <p className="text-gray-600 mb-4">
        Si tienes dudas o consultas sobre estos términos, puedes contactarnos en:{" "}
        <a href="mailto:soporte@tudominio.com" className="text-blue-600 hover:underline">
          soporte@tudominio.com
        </a>.
      </p>

      {/* <div className="mt-10 flex justify-center">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500">
          Acepto los Términos y Condiciones
        </button>
      </div> */}
    </div>
  );
};

export default Policies
