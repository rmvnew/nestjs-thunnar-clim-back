import { customPagination } from "./custom.pagination";



export class CustomPagination {

    private static instance: CustomPagination
    public static getInstance(): CustomPagination {
        if (!CustomPagination.instance) {
            CustomPagination.instance = new CustomPagination()
        }
        return CustomPagination.instance
    }


    async getPage(queryBuilder: any, filter: any): Promise<any> {

        const { sort, orderBy, limit, page, route } = filter;

        //^ Calcular o ponto de início (offset) para a paginação
        const skip = (page - 1) * limit;

        //^ Configurar a paginação na consulta
        queryBuilder.skip(skip).take(limit);

        //^ Realizar a consulta com paginação
        const [result, total] = await queryBuilder.getManyAndCount();

        //^ Chamar a função de paginação com os resultados e a contagem total
        return customPagination(result, page, limit, total, route, sort, orderBy);
    }



}