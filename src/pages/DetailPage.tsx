/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Spin,
  Button,
  Divider,
} from "antd";
import {
  StarFilled,
  CalendarOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await res.json();
        setAnime(data.data);
      } catch (err) {
        console.error("Failed to load anime:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!anime) return <div>Anime not found.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        Back to search
      </Button>

      <Card
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        cover={
          <img
            alt={anime.title}
            src={anime.images?.jpg?.large_image_url}
            style={{
              width: "100%",
              height: 450,
              objectFit: "cover",
            }}
          />
        }
      >
        <Title level={2}>{anime.title}</Title>
        <Text type="secondary">{anime.title_japanese}</Text>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical">
              <Text>
                <StarFilled style={{ color: "#faad14" }} /> Score:{" "}
                <b>{anime.score ?? "N/A"}</b>
              </Text>
              <Text>
                <CalendarOutlined /> Year: <b>{anime.year ?? "Unknown"}</b>
              </Text>
              <Text>Episodes: <b>{anime.episodes ?? "?"}</b></Text>
              <Text>Rank: <b>#{anime.rank ?? "?"}</b></Text>
              <Text>Type: <b>{anime.type}</b></Text>
              <Text>Duration: <b>{anime.duration}</b></Text>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={16}>
            <Title level={4}>Synopsis</Title>
            <Paragraph ellipsis={!showFull ? { rows: 5 } : false}>
              {anime.synopsis || "No synopsis available."}
            </Paragraph>
            <Button
              type="link"
              onClick={() => setShowFull(!showFull)}
              style={{ paddingLeft: 0 }}
            >
              {showFull ? "Show less" : "Read more"}
            </Button>

            <Divider />

            <Title level={4}>Genres</Title>
            <Space wrap>
              {anime.genres?.map((g: any) => (
                <Tag key={g.mal_id} color="blue">
                  {g.name}
                </Tag>
              ))}
            </Space>
          </Col>
        </Row>

        {anime.trailer?.embed_url && (
          <>
            <Divider />
            <Title level={4}>
              <PlayCircleOutlined /> Trailer
            </Title>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <iframe
                width="100%"
                height="400"
                src={anime.trailer.embed_url}
                title="Trailer"
                style={{ borderRadius: 8 }}
                allowFullScreen
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
