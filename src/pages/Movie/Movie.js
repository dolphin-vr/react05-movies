import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { serviceGetMovieDetails } from 'api';
import { Description } from 'components/Description/Description';
import { Loader } from 'components/Loader/Loader';
import { ErrMsg } from 'components/SharedLayout.styled';
import { AdditionNav, NavItem } from './Movie.styled';
import { Link, Outlet  } from 'react-router-dom';

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);

  const controllerRef = useRef();
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    setLoader(true);
    async function getDetails() {
      try {
        setError(false);
        const responce = await serviceGetMovieDetails(id, controllerRef.current.signal);
        setMovie(responce);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {setError(true)};
      } finally {
        setLoader(false);
      }
    }
    getDetails();

    return () => { controllerRef.current.abort() };
  }, [id]);

  const showDetails = !!movie;
  
  return (
    <div>
      {loader && <Loader />}
      {showDetails && <>
        <Description movie={movie} />
        <p>Additional information</p>
          <AdditionNav>
            <NavItem><Link to="cast">Cast</Link></NavItem>
            <NavItem><Link to="review">Reviews</Link></NavItem>
          </AdditionNav>
          <Outlet />
        </>}
      {error && <ErrMsg>Some Error</ErrMsg>}
    </div>
  );
}
