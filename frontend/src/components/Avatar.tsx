import styles from "../styles/Avatar.module.css";

// Definiere die Props mit einem Interface
interface AvatarProps {
  src: string;
  height?: number;  // Optionaler Wert, der standardmäßig auf 45 gesetzt ist
  text?: string;    // Optionaler Wert für den Text
}

const Avatar: React.FC<AvatarProps> = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text && <span>{text}</span>} {/* Nur anzeigen, wenn Text vorhanden ist */}
    </span>
  );
};

export default Avatar;
