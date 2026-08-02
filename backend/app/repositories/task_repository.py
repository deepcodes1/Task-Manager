from typing import List, Optional, Dict, Any
from app.config.cloudant import cloudant_manager
from app.utils.logger import logger

class TaskRepository:
    """Repository Layer for Cloudant NoSQL Database Operations."""

    def __init__(self):
        self.cloudant = cloudant_manager
        self.db_name = cloudant_manager.db_name
        # Fallback local in-memory document store when Cloudant is disconnected
        self._fallback_store: Dict[str, Dict[str, Any]] = {}

    def _is_cloudant_active(self) -> bool:
        return self.cloudant.client is not None

    def create_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new task document in IBM Cloudant."""
        doc_id = task_data.get("id") or task_data.get("_id")
        task_data["_id"] = doc_id

        if self._is_cloudant_active():
            try:
                response = self.cloudant.client.post_document(
                    db=self.db_name,
                    document=task_data
                ).get_result()
                
                task_data["_rev"] = response.get("rev")
                logger.info(f"Task successfully saved to IBM Cloudant with ID: {doc_id}")
                return task_data
            except Exception as e:
                logger.error(f"Error creating document in Cloudant: {str(e)}")

        # Fallback in-memory storage
        self._fallback_store[doc_id] = task_data
        logger.info(f"Task stored in fallback repository memory with ID: {doc_id}")
        return task_data

    def get_all_tasks(self) -> List[Dict[str, Any]]:
        """Retrieve all task documents from IBM Cloudant."""
        if self._is_cloudant_active():
            try:
                # Query all documents matching selector
                selector = {"id": {"$exists": True}}
                response = self.cloudant.client.post_find(
                    db=self.db_name,
                    selector=selector
                ).get_result()
                
                docs = response.get("docs", [])
                logger.info(f"Fetched {len(docs)} task documents from IBM Cloudant.")
                return docs
            except Exception as e:
                logger.error(f"Error retrieving all documents from Cloudant: {str(e)}")

        return list(self._fallback_store.values())

    def get_task_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get a single task document by task ID."""
        if self._is_cloudant_active():
            try:
                # Try fetching via Cloudant selector for custom 'id'
                response = self.cloudant.client.post_find(
                    db=self.db_name,
                    selector={"$or": [{"id": task_id}, {"_id": task_id}]}
                ).get_result()
                
                docs = response.get("docs", [])
                if docs:
                    return docs[0]
            except Exception as e:
                logger.error(f"Error retrieving document {task_id} from Cloudant: {str(e)}")

        return self._fallback_store.get(task_id)

    def update_task(self, task_id: str, update_fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing task document in IBM Cloudant."""
        existing = self.get_task_by_id(task_id)
        if not existing:
            return None

        updated_doc = {**existing, **update_fields}

        if self._is_cloudant_active():
            try:
                cloudant_id = existing.get("_id") or task_id
                rev = existing.get("_rev")

                if rev:
                    updated_doc["_rev"] = rev

                response = self.cloudant.client.post_document(
                    db=self.db_name,
                    document=updated_doc
                ).get_result()

                updated_doc["_rev"] = response.get("rev")
                logger.info(f"Task updated in IBM Cloudant with ID: {task_id}")
                return updated_doc
            except Exception as e:
                logger.error(f"Error updating document {task_id} in Cloudant: {str(e)}")

        self._fallback_store[task_id] = updated_doc
        return updated_doc

    def delete_task(self, task_id: str) -> bool:
        """Delete a task document from IBM Cloudant."""
        existing = self.get_task_by_id(task_id)
        if not existing:
            return False

        if self._is_cloudant_active():
            try:
                cloudant_id = existing.get("_id") or task_id
                rev = existing.get("_rev")

                if rev:
                    self.cloudant.client.delete_document(
                        db=self.db_name,
                        doc_id=cloudant_id,
                        rev=rev
                    ).get_result()
                    logger.info(f"Task deleted from IBM Cloudant with ID: {task_id}")
                    return True
            except Exception as e:
                logger.error(f"Error deleting document {task_id} from Cloudant: {str(e)}")

        if task_id in self._fallback_store:
            del self._fallback_store[task_id]
            return True
        return False

task_repository = TaskRepository()
