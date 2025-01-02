CREATE OR REPLACE FUNCTION get_nearby_places(
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    radius DOUBLE PRECISION
)
RETURNS TABLE(
    id INT,
    name VARCHAR,
    type VARCHAR,
    address TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    description TEXT,
    image_url TEXT,
    distance DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        id,
        name,
        type,
        address,
        latitude,
        longitude,
        description,
        image_url,
        (6371 * acos(
            cos(radians(lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(lon)) +
            sin(radians(lat)) * sin(radians(latitude))
        )) AS distance
    FROM places
    WHERE (6371 * acos(
            cos(radians(lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(lon)) +
            sin(radians(lat)) * sin(radians(latitude))
        )) <= radius
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;
