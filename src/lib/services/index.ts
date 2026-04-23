import { strapi } from "../strapi";

interface HeroData {
    titulo: string;
    fecha_evento: string | null;
    url_musica: string | null;
    detalle_evento: {
        nombre_pareja1: string;
        nombre_pareja2: string;
        lugar: string;
        frase_principal: string;
        imagen_fondo: {url: string} | null;

    }[] | null;

    timeline: {
        titulo: string;
        fecha: string;
        descripcion: string;
        id: number;
    }[] | null;
    
}






export async function fetchIndexData(id: string): Promise<HeroData | null> {

    const response  = await strapi.get<HeroData>(`/eventos/${id}?populate[detalle_evento][populate]=*&populate[timeline][populate]=*`);
    console.log('Respuesta del Strapi:', response);
    return response?.data || null;

}

