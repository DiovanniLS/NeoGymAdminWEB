import { useEffect, useState } from "react";
import api from "../services/api";
export default function DocumentoPreview({
  credencialId,
  tipo = "PROFISSIONAL",
  alt = "Documento",
}) {
  const [imagemUrl, setImagemUrl] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let urlTemporaria = null;

    async function carregarImagem() {
      setImagemUrl(null);
      setErro(false);

      try {
        const response = await api.get(
          `/credenciais/${credencialId}/arquivo`,
          {
            params: { tipo },
            responseType: "blob",
          }
        );

        urlTemporaria = URL.createObjectURL(response.data);

        if (!cancelado) {
          setImagemUrl(urlTemporaria);
        }
      } catch (error) {
        console.error("Erro ao carregar documento:", error);
        if (!cancelado) setErro(true);
      }
    }

    carregarImagem();

    return () => {
      cancelado = true;

      if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
      }
    };
  }, [credencialId, tipo]);

  if (erro) {
    return <p>Não foi possível carregar este documento.</p>;
  }

  if (!imagemUrl) {
    return <p>Carregando documento...</p>;
  }

  return (
    <img
      src={imagemUrl}
      alt={alt}
      style={{
        width: "100%",
        height: 350,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}