import { gql } from "graphql-request";
import sortNewsByImage from "./sortNewsByImage";


const fetchNews = async (
    category?: Category | string,
    keywords?: string,
    isDynamic?: boolean
    ) => {
    const query = gql`
        query MyQuery(
            $access_key: String!
            $categories: String!
            $keywords: String
        )   {
            myQuery(
                access_key: $access_key
                categories: $categories
                countries: "gb, ng, us"
                sort: "published_desc"
                keywords: $keywords
            ) {
                data {
                    author
                    category
                    country
                    image
                    description
                    language
                    source
                    published_at
                    title
                    url
                }
                pagination {
                    count
                    limit
                    offset
                    total
                }
            }
        }
    `;
    const res = await fetch("https://eirunepe.stepzen.net/api/billowing-clownfish/__graphql",{
        method: "POST",
        cache: isDynamic ? "no-cache" : "default",
        next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
        headers: { 
            "Content-Type": "application/json",
            Authorization: `apikey ${process.env.STEPZEN_API_KEY}`,
        },
        body: JSON.stringify({
            query,
            variables: {
                access_key: process.env.MEDIASTACK_API_KEY,
                categories: category,
                keywords: keywords,
            },
        }),
    }
    );

    const newsResponse = await res.json();
    
    
    const news = sortNewsByImage( await newsResponse.data.myQuery);
    return news;  
      
};


// let graphql = JSON.stringify({
//   query: `  query MyQuery {
//     myQuery(access_key: "6369c92d0b25a218927c25d9b2631f4a") {
//       data {
//         author
//         category
//         country
//         description
//         image
//         language
//         url
//         title
//         source
//         published_at
//       }
//       pagination {
//         count
//         limit
//         offset
//         total
//       }
//     }
//   }`,
//   variables: {}
// })

// let requestOptions = {
// method: 'POST',
// headers: {
//     "Content-Type": "application/json",
//     "Authorization": "apikey caringbah::stepzen.io+1000::d53805c963049b8cc201efab4e98a767df88108f9a2c6a87f059038b091ceeac", 
// },
// body: graphql
// };

// fetch("https://caringbah.stepzen.net/api/angry-seahorse/__graphql", requestOptions)
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log('error', error));

// stepzen import curl "http://api.mediastack.com/v1/news?access_key=28112d9425cf557cbb69f8acc7f9016d&countries=us%2Cgb&limit=100&offset=0&sort=published_desc"
export default fetchNews;