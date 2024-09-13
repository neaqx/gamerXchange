import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrashAlt, FaIdCard, FaKey } from "react-icons/fa";

// Typisierung der Props
interface MoreDropdownProps {
  handleEdit: () => void;
  handleDelete: () => void;
}

// ForwardRef-Komponente für die drei Punkte (Ellipsis)
const ThreeDots = React.forwardRef<HTMLSpanElement, { onClick: (e: React.MouseEvent) => void }>(
  ({ onClick }, ref) => (
    <span ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }}>
      <FaEllipsisV />
    </span>
  )
);

export const MoreDropdown: React.FC<MoreDropdownProps> = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu className="text-center" popperConfig={{ strategy: "fixed" }}>
        <Dropdown.Item className={styles.DropdownItem} onClick={handleEdit} aria-label="edit">
          <FaEdit /> Edit
        </Dropdown.Item>
        <Dropdown.Item className={styles.DropdownItem} onClick={handleDelete} aria-label="delete">
          <FaTrashAlt /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

// Typisierung für ProfileEditDropdown
interface ProfileEditDropdownProps {
  id: number;
}

export const ProfileEditDropdown: React.FC<ProfileEditDropdownProps> = ({ id }) => {
  const navigate = useNavigate(); // useNavigate statt useHistory

  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate(`/profiles/${id}/edit`)} aria-label="edit-profile">
          <FaEdit /> Edit profile
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate(`/profiles/${id}/edit/username`)} aria-label="edit-username">
          <FaIdCard /> Change username
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate(`/profiles/${id}/edit/password`)} aria-label="edit-password">
          <FaKey /> Change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
