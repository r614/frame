export async function getServerSideProps(context) {
  return {
    notFound: true,
  };
}

const err = () => {};

export default err;
