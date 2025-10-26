import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchAnimeList } from "../features/anime/animeSlice";
import {
  Input,
  Row,
  Col,
  Card,
  Typography,
  Spin,
  Layout,
  Pagination,
} from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;
const { Title } = Typography;
const { Content } = Layout;

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, query, pagination } = useSelector(
    (state: RootState) => state.anime
  );
  const [text, setText] = useState(query || "");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // only trigger if text changes (user typed something)
    debounceRef.current = setTimeout(() => {
      dispatch(fetchAnimeList({ query: text, page: 1 }));
      setCurrentPage(1);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, dispatch]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      dispatch(fetchAnimeList({ query: "", page: 1 }));
    }
  }, [dispatch]);

  // ✅ Page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchAnimeList({ query: text, page }));
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ maxWidth: 1600, margin: "0 auto", padding: "24px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          <VideoCameraOutlined /> Anime Search
        </Title>

        {/* 🔍 Instant Search Bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Input
            placeholder="Search anime..."
            allowClear
            size="large"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ maxWidth: 500 }}
          />
        </div>

        {/* 📺 Anime List */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {list.length > 0 ? (
              <>
                <Row gutter={[16, 16]} justify="center">
                  {list.map((anime) => (
                    <Col
                      key={anime.mal_id}
                      xs={12}
                      sm={8}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <Card
                        onClick={() => navigate(`/anime/${anime.mal_id}`)}
                        hoverable
                        cover={
                          <img
                            alt={anime.title}
                            src={anime.images.jpg.image_url}
                            style={{
                              height: 250,
                              width: "100%",
                              objectFit: "cover",
                              borderRadius: "8px 8px 0 0",
                            }}
                          />
                        }
                      >
                        <Meta title={anime.title} description={`⭐ ${anime.score ?? "N/A"}`} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <p style={{ textAlign: "center", marginTop: 50 }}>No record found.</p>
            )}

            {/* 📄 Pagination */}
            {pagination && pagination.last_visible_page > 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
                <Pagination
                  current={currentPage}
                  pageSize={25}
                  total={
                    pagination.items?.total ??
                    pagination.last_visible_page * 25
                  }
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
}
