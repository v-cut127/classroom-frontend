import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "@/constants";
import {CreateResponse, GetOneResponse, ListResponse} from "@/types";

if(!BACKEND_BASE_URL){
    throw new Error("BACKEND_BASE_URL environment variable is missing. Please set VITE_BASE_URL in your .env file");
}

const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({ resource }) => resource,

        buildQueryParams: async ({ resource, pagination, filters }) => {
            const page = pagination?.currentPage ?? 1;
            const pageSize = pagination?.pageSize ?? 10;

            const params: Record<string, string|number> = { page, limit: pageSize};

            filters?.forEach((filter) => {
                if ('field' in filter && 'value' in filter && filter.value !== undefined && filter.value !== null) {
                    const field = filter.field;
                    const value = String(filter.value);

                    if(resource === 'subjects'){
                        if(field === 'department') params.department = value;
                        if(field === 'name' || field === 'code') params.search = value;
                    }

                    if(resource === 'classes'){
                        if(field === 'name') params.search = value;
                        if(field === 'subject') params.subject = value;
                        if(field === 'teacher') params.teacher = value;
                    }

                    if(resource === 'users'){
                        if(field === 'name' || field === 'email') params.search = value;
                        if(field === 'role') params.role = value;
                    }

                    if(resource === 'departments'){
                        if(field === 'name' || field === 'code') params.search = value;
                    }
                }
            })

            return params;
        },

        mapResponse: async (response) => {
            const payload: ListResponse = await response.json();

            return payload.data ?? [];
        },
    },

    create:{
        getEndpoint: ({ resource }) => resource,

        buildBodyParams: async ({ variables}) => variables,

        mapResponse: async (response) => {
            const json: CreateResponse = await response.json();

            return { data: json.data ?? [] };
        }
    },

    getOne: {
        getEndpoint: ({ resource, id }) => `${resource}/${id}`,

        mapResponse: async (response) => {
            const json: GetOneResponse = await response.json();

            return { data: json.data ?? [] };
        }
    }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
