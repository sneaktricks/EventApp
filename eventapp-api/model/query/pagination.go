package query

import (
	"net/url"
	"strconv"
)

type PaginationParams struct {
	Page  int
	Limit int
}

// Parses PaginationParams from [url.Values].
// If "page" or "limit" are undefined, invalid integers, or less than 1,
// they are replaced by default values.
func ParsePaginationParamsFromURLValues(values url.Values) PaginationParams {
	pageParam := values.Get("page")
	limitParam := values.Get("limit")

	params := PaginationParams{
		Page:  1,
		Limit: 50,
	}

	if pageParam != "" {
		page, err := strconv.Atoi(pageParam)
		if err == nil && page >= 1 {
			params.Page = page
		}
	}
	if limitParam != "" {
		limit, err := strconv.Atoi(limitParam)
		if err == nil && limit >= 1 {
			params.Limit = limit
		}
	}

	return params
}
