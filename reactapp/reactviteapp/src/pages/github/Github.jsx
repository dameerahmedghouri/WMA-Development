import { useEffect, useState } from "react";
import axios from "axios";

export default function Github() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const [repositoryContents, setRepositoryContents] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [readmes, setReadmes] = useState({});
  const [readmeLoading, setReadmeLoading] = useState({});
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserData = async (value = username) => {
    const trimmedUsername = value.trim();

    if (!trimmedUsername) {
      setError("GitHub username لکھیں۔");
      return;
    }

    setLoading(true);
    setError("");
    setUserData(null);
    setRepositories([]);
    setSelectedRepository(null);
    setRepositoryContents({});
    setSelectedFile(null);
    setReadmes({});
    setReadmeLoading({});

    try {
      const apiUsername = encodeURIComponent(trimmedUsername);
      const userResponse = await axios.get(
        `https://api.github.com/users/${apiUsername}`
      );
      const publicRepositories = [];
      let page = 1;
      let repositoryPage;

      do {
        const repoResponse = await axios.get(
          `https://api.github.com/users/${apiUsername}/repos?per_page=100&page=${page}&sort=updated`
        );
        repositoryPage = repoResponse.data;
        publicRepositories.push(...repositoryPage);
        page += 1;
      } while (repositoryPage.length === 100);

      setUserData(userResponse.data);
      setRepositories(publicRepositories);
    } catch (requestError) {
      console.error("Error fetching user data:", requestError);
      if (requestError.response?.status === 404) {
        setError("GitHub username نہیں ملا۔ Spelling check کریں۔");
      } else {
        setError("GitHub data load نہیں ہو سکا۔ دوبارہ کوشش کریں۔");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = username.trim();

    if (query.length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=6`,
          { signal: controller.signal }
        );
        setSuggestions(response.data.items);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          console.error("Error fetching GitHub suggestions:", requestError);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [username]);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not Available";

  const loadRepositoryContents = async (repository, path = "") => {
    const key = `${repository.full_name}:${path}`;

    if (repositoryContents[key]) {
      return;
    }

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repository.full_name}/contents/${path}`
      );
      setRepositoryContents((current) => ({
        ...current,
        [key]: response.data,
      }));
    } catch (requestError) {
      console.error("Error fetching repository contents:", requestError);
      setError("Repository کا code load نہیں ہو سکا۔");
    }
  };

  const openFile = async (file) => {
    setFileLoading(true);
    try {
      const response = await axios.get(file.url);
      const binaryContent = atob(response.data.content.replace(/\s/g, ""));
      const bytes = Uint8Array.from(binaryContent, (character) =>
        character.charCodeAt(0)
      );
      const content = new TextDecoder().decode(bytes);
      setSelectedFile({ name: file.name, path: file.path, content });
    } catch (requestError) {
      console.error("Error fetching file:", requestError);
      setError("File کا code load نہیں ہو سکا۔");
    } finally {
      setFileLoading(false);
    }
  };

  const loadReadme = async (repository) => {
    if (readmes[repository.full_name] || readmeLoading[repository.full_name]) {
      return;
    }

    setReadmeLoading((current) => ({
      ...current,
      [repository.full_name]: true,
    }));

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repository.full_name}/readme`,
        { headers: { Accept: "application/vnd.github.raw+json" } }
      );
      setReadmes((current) => ({
        ...current,
        [repository.full_name]: response.data,
      }));
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setReadmes((current) => ({
          ...current,
          [repository.full_name]: "No README file found.",
        }));
      } else {
        console.error("Error fetching README:", requestError);
        setReadmes((current) => ({
          ...current,
          [repository.full_name]: "README load نہیں ہو سکی۔",
        }));
      }
    } finally {
      setReadmeLoading((current) => ({
        ...current,
        [repository.full_name]: false,
      }));
    }
  };

  return (
    <>
      <style>{`
        .github-page { min-height: 100%; }
        .github-search {
          position: relative;
          display: flex;
          gap: 12px;
          margin: 30px 0 20px;
        }
        .github-search input {
          flex: 1;
          min-width: 0;
          padding: 12px 15px;
          color: var(--white-2);
          background: var(--onyx);
          border: 1px solid var(--jet);
          border-radius: 10px;
          outline: none;
        }
        .github-search input:focus {
          border-color: var(--orange-yellow-crayola);
        }
        .github-search-box {
          position: relative;
          display: flex;
          flex: 1;
        }
        .github-search-box input {
          width: 100%;
        }
        .github-suggestions {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          left: 0;
          z-index: 5;
          padding: 6px;
          overflow: hidden;
          background: var(--eerie-black-1);
          border: 1px solid var(--jet);
          border-radius: 10px;
          box-shadow: var(--shadow-3);
        }
        .github-search .github-suggestion {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 10px;
          padding: 8px;
          color: var(--white-2);
          background: transparent;
          border: 0;
          border-radius: 7px;
          cursor: pointer;
          font-size: var(--fs-7);
          font-weight: var(--fw-400);
          text-align: left;
        }
        .github-search .github-suggestion:hover {
          color: var(--white-2);
          background: var(--onyx);
        }
        .github-search .github-suggestion img {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .github-search .github-suggestion small {
          display: block;
          margin-top: 2px;
          color: var(--light-gray-70);
          font-size: var(--fs-8);
        }
        .github-search button,
        .github-profile-link {
          padding: 12px 18px;
          color: var(--smoky-black);
          background: var(--orange-yellow-crayola);
          border: 0;
          border-radius: 10px;
          cursor: pointer;
          font-weight: var(--fw-500);
        }
        .github-search button:disabled {
          cursor: wait;
          opacity: 0.6;
        }
        .github-error,
        .github-status {
          margin-bottom: 20px;
          color: var(--bittersweet-shimmer);
        }
        .github-status { color: var(--light-gray-70); }
        .github-profile {
          display: flex;
          gap: 25px;
          align-items: flex-start;
          padding: 25px;
          background: var(--bg-gradient-jet);
          border: 1px solid var(--jet);
          border-radius: 16px;
          box-shadow: var(--shadow-2);
        }
        .github-avatar {
          width: 120px;
          height: 120px;
          flex: 0 0 auto;
          border-radius: 18px;
          object-fit: cover;
        }
        .github-profile-content { flex: 1; }
        .github-profile-content h3 {
          margin-bottom: 4px;
          color: var(--white-2);
          font-size: var(--fs-2);
        }
        .github-profile-content p {
          margin-bottom: 14px;
          color: var(--light-gray-70);
          line-height: 1.6;
        }
        .github-login,
        .github-meta { font-size: var(--fs-7); }
        .github-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin: 20px 0;
          color: var(--light-gray-70);
          font-size: var(--fs-7);
        }
        .github-stats strong {
          display: block;
          color: var(--orange-yellow-crayola);
          font-size: var(--fs-3);
        }
        .github-profile-link {
          display: inline-block;
          color: var(--smoky-black) !important;
        }
        .github-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 12px;
          margin-top: 20px;
        }
        .github-detail {
          padding: 12px;
          background: var(--onyx);
          border: 1px solid var(--jet);
          border-radius: 10px;
        }
        .github-detail-label {
          display: block;
          margin-bottom: 5px;
          color: var(--light-gray-70);
          font-size: var(--fs-8);
          text-transform: uppercase;
        }
        .github-detail-value {
          display: block;
          overflow-wrap: anywhere;
          color: var(--white-2);
          font-size: var(--fs-7);
        }
        .github-detail-value a {
          color: var(--orange-yellow-crayola);
        }
        .github-raw {
          margin-top: 20px;
          color: var(--light-gray-70);
        }
        .github-raw summary {
          cursor: pointer;
          color: var(--orange-yellow-crayola);
        }
        .github-raw pre {
          max-height: 300px;
          margin-top: 12px;
          padding: 15px;
          overflow: auto;
          color: var(--light-gray);
          background: var(--smoky-black);
          border: 1px solid var(--jet);
          border-radius: 10px;
          font-size: var(--fs-8);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .github-repositories {
          margin-top: 25px;
        }
        .github-repositories h3 {
          margin-bottom: 15px;
          color: var(--white-2);
          font-size: var(--fs-2);
        }
        .github-repository-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }
        .github-repository {
          padding: 15px;
          background: var(--bg-gradient-jet);
          border: 1px solid var(--jet);
          border-radius: 12px;
          transition: border-color var(--transition-1), box-shadow var(--transition-1);
        }
        .github-repository:hover,
        .github-repository.selected {
          border-color: var(--orange-yellow-crayola);
          box-shadow: var(--shadow-2);
        }
        .github-repository:not(.selected) .github-repository-details {
          display: none;
        }
        .github-repository.selected {
          grid-column: 1 / -1;
        }
        .github-repository h4 {
          margin-bottom: 7px;
          font-size: var(--fs-4);
        }
        .github-repository h4 a {
          color: var(--orange-yellow-crayola);
        }
        .github-repository p {
          margin-bottom: 12px;
          color: var(--light-gray-70);
          font-size: var(--fs-7);
          line-height: 1.5;
        }
        .github-repository-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          color: var(--light-gray-70);
          font-size: var(--fs-8);
        }
        .github-code-button {
          margin-top: 15px;
          padding: 8px 12px;
          color: var(--smoky-black);
          background: var(--orange-yellow-crayola);
          border: 0;
          border-radius: 7px;
          cursor: pointer;
          font-size: var(--fs-8);
          font-weight: var(--fw-500);
        }
        .github-file-tree {
          margin-top: 14px;
          padding: 12px;
          background: var(--smoky-black);
          border: 1px solid var(--jet);
          border-radius: 9px;
        }
        .github-file-item {
          display: flex;
          align-items: center;
          gap: 7px;
          width: 100%;
          padding: 6px 8px;
          color: var(--light-gray);
          background: transparent;
          border: 0;
          cursor: pointer;
          font-size: var(--fs-7);
          text-align: left;
        }
        .github-file-item:hover {
          color: var(--orange-yellow-crayola);
          background: var(--onyx);
        }
        .github-file-item.folder {
          color: var(--orange-yellow-crayola);
        }
        .github-file-code {
          max-height: 500px;
          margin-top: 15px;
          padding: 15px;
          overflow: auto;
          color: var(--light-gray);
          background: var(--smoky-black);
          border: 1px solid var(--jet);
          border-radius: 9px;
          font-size: var(--fs-8);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .github-readme-button {
          margin: 15px 8px 0 0;
          padding: 8px 12px;
          color: var(--white-2);
          background: transparent;
          border: 1px solid var(--jet);
          border-radius: 7px;
          cursor: pointer;
          font-size: var(--fs-8);
        }
        .github-readme-button:hover {
          color: var(--orange-yellow-crayola);
          border-color: var(--orange-yellow-crayola);
        }
        .github-readme {
          margin-top: 15px;
          padding: 18px;
          background: var(--smoky-black);
          border: 1px solid var(--jet);
          border-radius: 9px;
        }
        .github-readme h5 {
          margin-bottom: 12px;
          color: var(--orange-yellow-crayola);
          font-size: var(--fs-5);
        }
        .github-readme pre {
          max-height: 420px;
          margin: 0;
          overflow: auto;
          color: var(--light-gray);
          font-size: var(--fs-7);
          line-height: 1.6;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        @media (max-width: 580px) {
          .github-search { flex-direction: column; }
          .github-profile {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .github-stats { justify-content: center; }
        }
      `}</style>
      <article className="github-page active">
      <header>
        <h2 className="h2 article-title">GitHub User Search</h2>
      </header>

      <div className="github-search">
        <div className="github-search-box">
          <input
            type="text"
            placeholder="Search GitHub username..."
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                fetchUserData();
                setSuggestions([]);
              }
            }}
          />
          {username.trim().length >= 2 &&
            (suggestions.length > 0 || suggestionLoading) && (
            <div className="github-suggestions">
              {suggestionLoading && (
                <p className="github-status">Accounts search ہو رہے ہیں...</p>
              )}
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  className="github-suggestion"
                  key={suggestion.id}
                  onClick={() => {
                    setUsername(suggestion.login);
                    setSuggestions([]);
                    fetchUserData(suggestion.login);
                  }}
                >
                  <img src={suggestion.avatar_url} alt="" />
                  <span>
                    {suggestion.login}
                    <small>{suggestion.type}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={fetchUserData} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="github-error" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <p className="github-status" role="status">
          GitHub profile load ہو رہا ہے...
        </p>
      )}

      {userData && !loading && (
        <>
        <section className="github-profile">
          <img
            src={userData.avatar_url}
            alt={`${userData.login} avatar`}
            className="github-avatar"
          />
          <div className="github-profile-content">
            <h3>{userData.name || userData.login}</h3>
            <p className="github-login">@{userData.login}</p>
            <p>{userData.bio || "This user has not added a biography yet."}</p>
            <div className="github-stats">
              <span>
                <strong>{userData.followers}</strong> Followers
              </span>
              <span>
                <strong>{userData.following}</strong> Following
              </span>
              <span>
                <strong>{userData.public_repos}</strong> Repositories
              </span>
            </div>
            <p className="github-meta">
              Joined {formatDate(userData.created_at)} · Updated{" "}
              {formatDate(userData.updated_at)}
            </p>
            <div className="github-details">
              <div className="github-detail">
                <span className="github-detail-label">Company</span>
                <span className="github-detail-value">
                  {userData.company || "Not Available"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Location</span>
                <span className="github-detail-value">
                  {userData.location || "Not Available"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Email</span>
                <span className="github-detail-value">
                  {userData.email || "Not Available"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Website</span>
                <span className="github-detail-value">
                  {userData.blog ? (
                    <a href={userData.blog} target="_blank" rel="noreferrer">
                      {userData.blog}
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Twitter</span>
                <span className="github-detail-value">
                  {userData.twitter_username
                    ? `@${userData.twitter_username}`
                    : "Not Available"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Account Type</span>
                <span className="github-detail-value">
                  {userData.type || "Not Available"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">User ID</span>
                <span className="github-detail-value">{userData.id}</span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Node ID</span>
                <span className="github-detail-value">{userData.node_id}</span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Public Gists</span>
                <span className="github-detail-value">{userData.public_gists}</span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Hireable</span>
                <span className="github-detail-value">
                  {userData.hireable === null
                    ? "Not Available"
                    : userData.hireable
                      ? "Yes"
                      : "No"}
                </span>
              </div>
              <div className="github-detail">
                <span className="github-detail-label">Site Admin</span>
                <span className="github-detail-value">
                  {userData.site_admin ? "Yes" : "No"}
                </span>
              </div>
            </div>
            <a
              href={userData.html_url}
              target="_blank"
              rel="noreferrer"
              className="github-profile-link"
            >
              Open GitHub Profile
            </a>
            <details className="github-raw">
              <summary>Show complete API response</summary>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </details>
          </div>
        </section>
        <section className="github-repositories">
          <h3>Public Repositories ({repositories.length})</h3>
          <div className="github-repository-list">
            {repositories.map((repository) => (
              <article
                className={`github-repository active ${
                  selectedRepository?.id === repository.id ? "selected" : ""
                }`}
                key={repository.id}
                onClick={() => {
                  setSelectedRepository(repository);
                  loadRepositoryContents(repository);
                  loadReadme(repository);
                }}
              >
                <h4>
                  <a
                    href={repository.html_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {repository.name}
                  </a>
                </h4>
                <div className="github-repository-details">
                <p>
                  {repository.description || "No description available."}
                </p>
                <div className="github-repository-meta">
                  <span>Language: {repository.language || "Not specified"}</span>
                  <span>Stars: {repository.stargazers_count}</span>
                  <span>Forks: {repository.forks_count}</span>
                  <span>Issues: {repository.open_issues_count}</span>
                  <span>Size: {repository.size} KB</span>
                  <span>Updated: {formatDate(repository.updated_at)}</span>
                  <span>
                    {repository.fork ? "Forked repository" : "Original repository"}
                  </span>
                  <span>
                    {repository.license?.name || "No license specified"}
                  </span>
                </div>
                <button
                  type="button"
                  className="github-code-button"
                  onClick={() => loadRepositoryContents(repository)}
                >
                  Open code
                </button>
                <button
                  type="button"
                  className="github-readme-button"
                  onClick={() => loadReadme(repository)}
                >
                  {readmeLoading[repository.full_name]
                    ? "Loading README..."
                    : "Open README"}
                </button>
                {readmes[repository.full_name] && (
                  <div className="github-readme">
                    <h5>README.md</h5>
                    <pre>{readmes[repository.full_name]}</pre>
                  </div>
                )}
                {repositoryContents[`${repository.full_name}:`] && (
                  <div className="github-file-tree">
                    {repositoryContents[`${repository.full_name}:`].map((item) => (
                      <div key={item.sha}>
                        {item.type === "dir" ? (
                          <button
                            type="button"
                            className="github-file-item folder"
                            onClick={() =>
                              loadRepositoryContents(repository, item.path)
                            }
                          >
                            📁 {item.path}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="github-file-item"
                            onClick={() => openFile(item)}
                          >
                            📄 {item.path}
                          </button>
                        )}
                        {repositoryContents[`${repository.full_name}:${item.path}`] &&
                          repositoryContents[`${repository.full_name}:${item.path}`].map(
                            (child) => (
                              <button
                                type="button"
                                className={`github-file-item ${
                                  child.type === "dir" ? "folder" : ""
                                }`}
                                style={{ paddingLeft: "28px" }}
                                key={child.sha}
                                onClick={() =>
                                  child.type === "dir"
                                    ? loadRepositoryContents(repository, child.path)
                                    : openFile(child)
                                }
                              >
                                {child.type === "dir" ? "📁" : "📄"} {child.path}
                              </button>
                            )
                          )}
                      </div>
                    ))}
                    {fileLoading && <p className="github-status">File load ہو رہی ہے...</p>}
                    {selectedFile && (
                      <pre className="github-file-code">
                        {selectedFile.path}{"\n\n"}{selectedFile.content}
                      </pre>
                    )}
                  </div>
                )}
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
      )}
      </article>
    </>
  );
}
