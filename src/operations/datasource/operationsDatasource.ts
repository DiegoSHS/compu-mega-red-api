import { Operation } from "../entities/operation.entity";

/**
 * OperationsDatasource
 * Define la interfaz para las operaciones de datos relacionadas con las operaciones.
 */
export abstract class OperationsDatasource {
    /**
     * Crea una nueva operación.
     * @param data Datos de la operación a crear
     * @returns La operación creada
     */
    abstract create(data: Operation): Promise<Operation>;
    /**
     * Busca una operación por su ID.
     * @param id uuid de la operacion a buscar
     * @return la operación que coincide con el ID
     */
    abstract findOne(id: string): Promise<Operation>;
    /**
     * Actualiza una operación existente.
     * @param id uuid de la operación para actualizar
     * @param data Datos parciales o completos de la operación a actualizar
     * @return La operación actualizada
     */
    abstract updateOne(id: string, data: Partial<Operation>): Promise<Operation>;
    /**
     * Elimina una operación por su ID.
     * @param id uuid de la operación a eliminar
     * @returns La operación eliminada
     */
    abstract deleteOne(id: string): Promise<Operation>;
    /**
     * Busca operaciones por año y mes.
     * @param year Año de las operaciones a buscar
     * @param month Mes de las operaciones a buscar
     * @return Lista de operaciones que coinciden con el año y mes
     */
    abstract findByYearAndMonth(year: number, month: number): Promise<Operation[]>;
    /**
     * Obtiene todas las operaciones de tipo venta.
     * @return Lista de operaciones de tipo venta
     */
    abstract getSales(): Promise<Operation[]>;
    /**
     * Obtiene todas las operaciones de tipo compra.
     * @return Lista de operaciones de tipo compra
     */
    abstract getPurchases(): Promise<Operation[]>;
}