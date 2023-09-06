const Skeleton = ({ children, loading, fallback }) => {
    if (loading) return fallback ? fallback : children

    return children
}

export default Skeleton