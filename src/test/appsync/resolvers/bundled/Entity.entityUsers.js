// apps/backend/src/appsync/resolvers/Entity.entityUsers.ts
import { util as util2 } from "@aws-appsync/utils";

// apps/backend/src/appsync/helpers/dynamodb.ts
import {
  util
} from "@aws-appsync/utils";
var dynamodbQueryRequest = ({
  key,
  value,
  filter: f = void 0,
  index,
  limit = 20,
  sortDirection = "ASC",
  nextToken = void 0
}) => {
  const filter = f ? JSON.parse(util.transform.toDynamoDBFilterExpression(f)) : void 0;
  const expression = `#key = :key`;
  const expressionNames = { "#key": key };
  const expressionValues = util.dynamodb.toMapValues({ ":key": value });
  const query = {
    operation: "Query",
    query: { expression, expressionNames, expressionValues },
    index: index || void 0,
    limit,
    nextToken,
    scanIndexForward: sortDirection === "ASC",
    select: "ALL_ATTRIBUTES"
  };
  if (filter) {
    query.filter = filter;
  }
  return query;
};

// apps/backend/src/appsync/resolvers/Entity.entityUsers.ts
function request(ctx) {
  console.log("Entity.entityUsers request ctx: ", ctx);
  const { id, nextToken, limit = 20 } = ctx.source;
  return dynamodbQueryRequest({
    key: "entityId",
    value: id,
    index: "entityUsersByEntity",
    limit,
    nextToken
  });
}
function response(ctx) {
  const { error, result } = ctx;
  console.log("Entity.entityUsers response ctx: ", ctx);
  if (error) {
    return util2.appendError(error.message, error.type, result);
  }
  const { items = [], nextToken } = result;
  return { items, nextToken };
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vYXBwc3luYy9yZXNvbHZlcnMvRW50aXR5LmVudGl0eVVzZXJzLnRzIiwgIi4uLy4uLy4uLy4uL2FwcHN5bmMvaGVscGVycy9keW5hbW9kYi50cyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUF3QyxRQUFBQSxhQUFZOzs7QUNBcEQ7QUFBQSxFQVdFO0FBQUEsT0FDSztBQW1FQSxJQUFNLHVCQUF1QixDQUFDO0FBQUEsRUFDbkM7QUFBQSxFQUNBO0FBQUEsRUFDQSxRQUFRLElBQUk7QUFBQSxFQUNaO0FBQUEsRUFDQSxRQUFRO0FBQUEsRUFDUixnQkFBZ0I7QUFBQSxFQUNoQixZQUFZO0FBQ2QsTUFBdUQ7QUFDckQsUUFBTSxTQUFTLElBQ1gsS0FBSyxNQUFNLEtBQUssVUFBVSwyQkFBMkIsQ0FBQyxDQUFDLElBQ3ZEO0FBQ0osUUFBTSxhQUFhO0FBQ25CLFFBQU0sa0JBQWtCLEVBQUUsUUFBUSxJQUFJO0FBQ3RDLFFBQU0sbUJBQW1CLEtBQUssU0FBUyxZQUFZLEVBQUUsUUFBUSxNQUFNLENBQUM7QUFFcEUsUUFBTSxRQUE4QjtBQUFBLElBQ2xDLFdBQVc7QUFBQSxJQUNYLE9BQU8sRUFBRSxZQUFZLGlCQUFpQixpQkFBaUI7QUFBQSxJQUN2RCxPQUFPLFNBQVM7QUFBQSxJQUNoQjtBQUFBLElBQ0E7QUFBQSxJQUNBLGtCQUFrQixrQkFBa0I7QUFBQSxJQUNwQyxRQUFRO0FBQUEsRUFDVjtBQUVBLE1BQUksUUFBUTtBQUNWLFVBQU0sU0FBUztBQUFBLEVBQ2pCO0FBRUEsU0FBTztBQUNUOzs7QUQzR08sU0FBUyxRQUFRLEtBQW9DO0FBQzFELFVBQVEsSUFBSSxvQ0FBb0MsR0FBRztBQUNuRCxRQUFNLEVBQUUsSUFBSSxXQUFXLFFBQVEsR0FBRyxJQUFJLElBQUk7QUFFMUMsU0FBTyxxQkFBcUI7QUFBQSxJQUMxQixLQUFLO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxFQUNGLENBQUM7QUFDSDtBQUNPLFNBQVMsU0FBUyxLQUFjO0FBQ3JDLFFBQU0sRUFBRSxPQUFPLE9BQU8sSUFBSTtBQUMxQixVQUFRLElBQUkscUNBQXFDLEdBQUc7QUFDcEQsTUFBSSxPQUFPO0FBQ1QsV0FBT0MsTUFBSyxZQUFZLE1BQU0sU0FBUyxNQUFNLE1BQU0sTUFBTTtBQUFBLEVBQzNEO0FBQ0EsUUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLFVBQVUsSUFBSTtBQUNsQyxTQUFPLEVBQUUsT0FBTyxVQUFVO0FBQzVCOyIsCiAgIm5hbWVzIjogWyJ1dGlsIiwgInV0aWwiXQp9Cg==
